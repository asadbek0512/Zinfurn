import { Logger, Inject, forwardRef } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
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

interface MarkReadPayload {
	notificationIds: string[];
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
		console.log(`✅ Connection [${clientNick}] & total: [${this.summaryClient}]`);

		// Send connection info
		const infoMsg: InfoPayload = {
			event: 'info',
			totalClients: this.summaryClient,
			memberData: authMember,
			action: 'joined',
		};
		this.emitMessage(infoMsg);
		client.send(JSON.stringify({ event: 'getMessages', list: this.messagesList }));

		// Send notifications after connection is established (only for authenticated users)
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

			// Get unread notifications
			const unreadNotifications = await this.notificationService.getUnreadNotifications(authMember._id.toString());

			// Send notifications to the client
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
			// Silent fail to maintain user experience
			this.logger.error('Error in handleGetNotifications:', error);
		}
	}

	@SubscribeMessage('get_notifications')
	public async handleGetNotificationsEvent(client: WebSocket): Promise<void> {
		await this.handleGetNotifications(client);
	}

	@SubscribeMessage('markNotificationsAsRead')
	public async handleMarkNotificationsAsRead(client: WebSocket, data: any): Promise<void> {
		try {
			const authMember = this.clientsAuthMap.get(client);
			if (!authMember) return;

			// Handle both array of IDs or single ID
			const notificationIds = Array.isArray(data) ? data : [data];

			if (!notificationIds.length) return;

			// Get the notifications to mark as read
			const notifications = await this.notificationService.getNotificationsByIds(
				notificationIds,
				authMember._id.toString(),
			);

			if (notifications.length > 0) {
				// Mark notifications as read
				await this.notificationService.markMultipleAsRead(authMember._id.toString(), notifications);

				// Send status updates for notifications that were marked as read
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
		this.logger.verbose(`Disconnected [${clientNick}] & total  [${this.summaryClient}]`);

		const infoMsg: InfoPayload = {
			event: 'info',
			totalClients: this.summaryClient,
			memberData: authMember ?? null,
			action: 'left',
		};
		this.broadcastMessage(client, infoMsg);
	}

	@SubscribeMessage('message')
	public async handleMessage(client: WebSocket, payload: any): Promise<void> {
		const authMember = this.clientsAuthMap.get(client);

		// Parse payload - could be string or object with 'data' and 'replyTo' fields
		let messageText: string = '';
		let replyTo: { text: string; memberNick: string } | undefined;

		// First, try to parse payload as JSON if it's a string
		let parsedPayload: any = payload;
		if (typeof payload === 'string') {
			try {
				parsedPayload = JSON.parse(payload);
			} catch (e) {
				// If parsing fails, treat as plain text message
				messageText = payload;
				parsedPayload = null;
			}
		}

		// If we successfully parsed JSON or got an object
		if (parsedPayload && typeof parsedPayload === 'object') {
			// Check if payload has 'data' field (new format) or is direct message
			if (parsedPayload.data !== undefined) {
				messageText = parsedPayload.data;
				// Extract replyTo if present
				if (parsedPayload.replyTo) {
					replyTo = {
						text: parsedPayload.replyTo.text,
						memberNick: parsedPayload.replyTo.memberNick,
					};
				}
			} else if (parsedPayload.text !== undefined) {
				messageText = parsedPayload.text;
				// Also check for replyTo in direct format
				if (parsedPayload.replyTo) {
					replyTo = {
						text: parsedPayload.replyTo.text,
						memberNick: parsedPayload.replyTo.memberNick,
					};
				}
			} else {
				messageText = String(parsedPayload);
			}
		} else if (!messageText) {
			// Fallback for plain string messages
			messageText = String(payload);
		}

		const newMessage: MessagePayload = {
			event: 'message',
			text: messageText,
			memberData: authMember ?? null,
			replyTo,
		};

		const clientNick: string = authMember?.memberNick ?? 'Guest';
		this.logger.log(`NEW MESSAGE [${clientNick}] : ${messageText}`);
		if (replyTo) {
			this.logger.log(`Replying to: ${replyTo.memberNick} - ${replyTo.text}`);
		}
		console.log(`📩 NEW MESSAGE [${clientNick}] : ${messageText}`, replyTo ? `Replying to: ${replyTo.memberNick}` : '');

		this.messagesList.push(newMessage);
		if (this.messagesList.length >= 5) this.messagesList.splice(0, this.messagesList.length - 5);

		this.emitMessage(newMessage);
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

	// Method for sending notifications
	public sendNotification(userId: string, notification: NotificationPayload) {
		let notificationsSent = 0;
		this.server.clients.forEach((client) => {
			const authMember = this.clientsAuthMap.get(client);

			if (client.readyState === WebSocket.OPEN) {
				if (authMember && authMember._id.toString() === userId) {
					client.send(
						JSON.stringify({
							event: 'notification',
							payload: notification,
						}),
					);
					notificationsSent++;
				}
			}
		});
	}
}

/*
 MESSAGE TARGET:
    1. Client (only client)
    2. Broadcast (except clients )
    3. Emit (all  clients)
 */
