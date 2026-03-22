import { Logger, Inject, forwardRef } from '@nestjs/common';
import { OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';
import * as WebSocket from 'ws';
import { AuthService } from '../components/auth/auth.service';
import { Member } from '../libs/dto/member/member';
import * as url from 'url';
import { NotificationService } from '../components/notification/notification.service';

interface MessagePayload {
	event: string;
	text: string;
	memberData: Member | null;
	replyTo?: {
		text: string;
		memberNick: string;
	};
	createdAt?: string;
}

interface InfoPayload {
	event: string;
	totalClients: number;
	memberData: Member | null;
	action: string;
}

interface NotificationPayload {
	id: string;
	title: string;
	desc?: string;
	type: string;
	status: string;
	createdAt: Date;
}

@WebSocketGateway({ transport: ['websocket'], secure: false })
export class SocketGateway implements OnGatewayInit {
	private logger: Logger = new Logger('SocketEventsGateway');
	private summaryClient: number = 0;
	private clientsAuthMap = new Map<WebSocket, Member | null>();
	private messagesList: MessagePayload[] = [];

	constructor(
		private authService: AuthService,
		@Inject(forwardRef(() => NotificationService))
		private notificationService: NotificationService,
	) {}

	@WebSocketServer()
	server: Server;

	public afterInit(server: Server) {
		this.logger.verbose(`WebSocket Server Initialized total: [${this.summaryClient}]`);
	}

	private async retrieveAuth(req: any): Promise<Member | null> {
		try {
			const parseUrl = url.parse(req.url, true);
			const { token } = parseUrl.query;
			return await this.authService.verifyToken(token as string);
		} catch (err) {
			return null;
		}
	}

	public async handleConnection(client: WebSocket, req: any) {
		const authMember = await this.retrieveAuth(req);

		this.summaryClient++;
		this.clientsAuthMap.set(client, authMember);

		const clientNick: string = authMember?.memberNick ?? 'Guest';
		this.logger.log(`Connection [${clientNick}] & total: [${this.summaryClient}]`);

		const infoMsg: InfoPayload = {
			event: 'info',
			totalClients: this.summaryClient,
			memberData: authMember,
			action: 'joined',
		};
		this.emitMessage(infoMsg);
		client.send(JSON.stringify({ event: 'getMessages', list: this.messagesList }));

		client.on('message', async (data: any) => {
			try {
				const parsed = JSON.parse(data.toString());

				if (parsed.event === 'message') {
					let messageText = parsed.data ?? parsed.text ?? '';
					let replyTo: { text: string; memberNick: string } | undefined = undefined;

					if (parsed.replyTo) {
						replyTo = {
							text: String(parsed.replyTo.text ?? ''),
							memberNick: String(parsed.replyTo.memberNick ?? 'User'),
						};
					}

					const newMessage: MessagePayload = {
						event: 'message',
						text: messageText,
						memberData: authMember ?? null,
						replyTo: replyTo,
						createdAt: new Date().toISOString(),
					};

					this.messagesList.push(newMessage);
					if (this.messagesList.length > 50) this.messagesList = this.messagesList.slice(-50);

					this.emitMessage(newMessage);
				} else if (parsed.event === 'getMessages') {
					client.send(JSON.stringify({ event: 'getMessages', list: this.messagesList }));
				} else if (parsed.event === 'get_notifications') {
					await this.handleGetNotifications(client);
				} else if (parsed.event === 'markNotificationsAsRead') {
					await this.handleMarkNotificationsAsRead(client, parsed.data);
				}
			} catch (e) {}
		});

		if (authMember) {
			setTimeout(() => {
				this.handleGetNotifications(client).catch((err) => {
					this.logger.error('Error sending notifications on connection:', err);
				});
			}, 100);
		}
	}

	private async handleGetNotifications(client: WebSocket) {
		try {
			const authMember = this.clientsAuthMap.get(client);
			if (!authMember) return;

			const unreadNotifications = await this.notificationService.getUnreadNotifications(authMember._id.toString());

			if (unreadNotifications.length > 0) {
				client.send(
					JSON.stringify({
						event: 'notifications_list',
						data: unreadNotifications.map((notification) => ({
							id: notification._id.toString(),
							title: notification.notificationTitle,
							desc: notification.notificationDesc,
							type: notification.notificationType,
							status: notification.notificationStatus,
							createdAt: notification.createdAt,
						})),
					}),
				);
			}
		} catch (error) {
			this.logger.error('Error in handleGetNotifications:', error);
		}
	}

	private async handleMarkNotificationsAsRead(client: WebSocket, data: any): Promise<void> {
		try {
			const authMember = this.clientsAuthMap.get(client);
			if (!authMember) return;

			const notificationIds = Array.isArray(data) ? data : [data];
			if (!notificationIds.length) return;

			const notifications = await this.notificationService.getNotificationsByIds(
				notificationIds,
				authMember._id.toString(),
			);

			if (notifications.length > 0) {
				await this.notificationService.markMultipleAsRead(authMember._id.toString(), notifications);

				notifications.forEach((notification) => {
					client.send(
						JSON.stringify({
							event: 'notificationStatus',
							payload: {
								id: notification._id.toString(),
								status: 'READ',
							},
						}),
					);
				});
			}
		} catch (error) {
			this.logger.error('Error in handleMarkNotificationsAsRead:', error);
		}
	}

	public handleDisconnect(client: WebSocket) {
		const authMember = this.clientsAuthMap.get(client);
		this.summaryClient--;
		this.clientsAuthMap.delete(client);

		const clientNick: string = authMember?.memberNick ?? 'Guest';
		this.logger.verbose(`Disconnected [${clientNick}] & total [${this.summaryClient}]`);

		const infoMsg: InfoPayload = {
			event: 'info',
			totalClients: this.summaryClient,
			memberData: authMember ?? null,
			action: 'left',
		};
		this.broadcastMessage(client, infoMsg);
	}

	private broadcastMessage(sender: WebSocket, message: InfoPayload | MessagePayload) {
		this.server.clients.forEach((client) => {
			if (client !== sender && client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(message));
			}
		});
	}

	private emitMessage(message: InfoPayload | MessagePayload) {
		this.server.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(message));
			}
		});
	}

	public sendNotification(userId: string, notification: NotificationPayload) {
		this.server.clients.forEach((client) => {
			const authMember = this.clientsAuthMap.get(client);
			if (client.readyState === WebSocket.OPEN && authMember && authMember._id.toString() === userId) {
				client.send(JSON.stringify({ event: 'notification', payload: notification }));
			}
		});
	}
}
