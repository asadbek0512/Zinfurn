import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { Conversation, Message } from '../../libs/dto/message/message';
import { ReplyMessageInput, SendMessageInput, SendRepairRequestInput } from '../../libs/dto/message/message.input';
import { MessageStatus } from '../../libs/enums/message.enum';
import { NotificationType, NotificationGroup } from '../../libs/enums/notification.enum';
import { Message as Msg } from '../../libs/enums/common_enum';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class MessageService {
	constructor(
		@InjectModel('Message') private readonly messageModel: Model<Message>,
		@InjectModel('Property') private readonly propertyModel: Model<any>,
		@InjectModel('Member') private readonly memberModel: Model<any>,
		private readonly notificationService: NotificationService,
	) {}

	private convId(propertyId: string, a: string, b: string): string {
		return [String(a), String(b)].sort().join('_') + '_' + String(propertyId);
	}

	public async sendMessage(senderId: ObjectId, input: SendMessageInput): Promise<Message> {
		const property = await this.propertyModel.findById(input.propertyId);
		if (!property) throw new BadRequestException(Msg.NO_DATA_FOUND);

		const receiverId = property.memberId;
		if (String(receiverId) === String(senderId)) throw new BadRequestException('You cannot message your own listing');

		const conversationId = this.convId(String(input.propertyId), String(senderId), String(receiverId));
		const message = await this.messageModel.create({
			conversationId,
			propertyId: input.propertyId,
			senderId,
			receiverId,
			message: input.message,
			messageStatus: MessageStatus.WAIT,
		});

		await this.notifyNew(senderId, receiverId, input.propertyId, property.propertyTitle, input.message);
		return message as unknown as Message;
	}

	public async replyMessage(senderId: ObjectId, input: ReplyMessageInput): Promise<Message> {
		const last = await this.messageModel.findOne({ conversationId: input.conversationId }).sort({ createdAt: -1 });
		if (!last) throw new BadRequestException(Msg.NO_DATA_FOUND);
		const me = String(senderId);
		if (me !== String(last.senderId) && me !== String(last.receiverId)) {
			throw new BadRequestException('Not a participant of this conversation');
		}
		const receiverId = me === String(last.senderId) ? last.receiverId : last.senderId;

		const message = await this.messageModel.create({
			conversationId: input.conversationId,
			propertyId: last.propertyId,
			senderId,
			receiverId,
			message: input.message,
			messageStatus: MessageStatus.WAIT,
		});

		const property = last.propertyId ? await this.propertyModel.findById(last.propertyId) : null;
		await this.notifyNew(senderId, receiverId, last.propertyId ? String(last.propertyId) : undefined, property?.propertyTitle, input.message);
		return message as unknown as Message;
	}

	public async sendRepairRequest(senderId: ObjectId, input: SendRepairRequestInput): Promise<Message> {
		const tech = await this.memberModel.findById(input.technicianId);
		if (!tech) throw new BadRequestException(Msg.NO_DATA_FOUND);
		if (String(tech._id) === String(senderId)) throw new BadRequestException('You cannot request your own service');

		const conversationId = [String(senderId), String(tech._id)].sort().join('_') + '_repair';
		const parts: string[] = [input.message.trim()];
		if (input.address) parts.push(`📍 ${input.address}`);
		if (input.phone) parts.push(`📞 ${input.phone}`);
		const fullMessage = parts.join('\n');

		const message = await this.messageModel.create({
			conversationId,
			kind: 'REPAIR',
			senderId,
			receiverId: tech._id,
			message: fullMessage,
			messageStatus: MessageStatus.WAIT,
		});

		await this.notifyNew(senderId, tech._id, undefined, undefined, input.message, true);
		return message as unknown as Message;
	}

	private async notifyNew(senderId: ObjectId, receiverId: any, propertyId: string | undefined, propertyTitle: string | undefined, text: string, isRepair = false) {
		const sender = await this.memberModel.findById(senderId);
		const nick = sender ? sender.memberNick : 'Someone';
		const short = text.length > 60 ? text.slice(0, 60) + '...' : text;
		await this.notificationService.createNotification({
			notificationType: NotificationType.MESSAGE,
			notificationGroup: isRepair ? NotificationGroup.REPAIR_PROPERTY : NotificationGroup.PROPERTY,
			notificationTitle: isRepair ? 'New Repair Request' : 'New Message',
			notificationDesc: `${nick}: ${short}`,
			authorId: String(senderId),
			receiverId: String(receiverId),
			...(propertyId ? { propertyId } : {}),
		} as any);
	}

	public async getMyConversations(memberId: ObjectId): Promise<Conversation[]> {
		const me = new Types.ObjectId(String(memberId));
		const result = await this.messageModel.aggregate([
			{ $match: { $or: [{ senderId: me }, { receiverId: me }] } },
			{ $sort: { createdAt: -1 } },
			{
				$group: {
					_id: '$conversationId',
					propertyId: { $first: '$propertyId' },
					kind: { $first: '$kind' },
					lastMessage: { $first: '$message' },
					lastMessageAt: { $first: '$createdAt' },
					lastSender: { $first: '$senderId' },
					lastReceiver: { $first: '$receiverId' },
					unreadCount: {
						$sum: { $cond: [{ $and: [{ $eq: ['$receiverId', me] }, { $eq: ['$messageStatus', MessageStatus.WAIT] }] }, 1, 0] },
					},
				},
			},
			{ $addFields: { partnerId: { $cond: [{ $eq: ['$lastSender', me] }, '$lastReceiver', '$lastSender'] } } },
			{ $lookup: { from: 'members', localField: 'partnerId', foreignField: '_id', as: 'partner' } },
			{ $unwind: { path: '$partner', preserveNullAndEmptyArrays: true } },
			{ $lookup: { from: 'properties', localField: 'propertyId', foreignField: '_id', as: 'property' } },
			{ $unwind: { path: '$property', preserveNullAndEmptyArrays: true } },
			{ $sort: { lastMessageAt: -1 } },
			{
				$project: {
					_id: 0,
					conversationId: '$_id',
					propertyId: 1,
					kind: 1,
					propertyTitle: '$property.propertyTitle',
					propertyImage: { $arrayElemAt: ['$property.propertyImages', 0] },
					lastMessage: 1,
					lastMessageAt: 1,
					unreadCount: 1,
					partner: 1,
				},
			},
		]);
		return result as Conversation[];
	}

	public async getConversation(memberId: ObjectId, conversationId: string): Promise<Message[]> {
		const me = new Types.ObjectId(String(memberId));
		const exists = await this.messageModel.findOne({ conversationId, $or: [{ senderId: me }, { receiverId: me }] });
		if (!exists) throw new BadRequestException(Msg.NO_DATA_FOUND);

		// mark received messages as read
		await this.messageModel.updateMany(
			{ conversationId, receiverId: me, messageStatus: MessageStatus.WAIT },
			{ messageStatus: MessageStatus.READ },
		);

		const result = await this.messageModel.aggregate([
			{ $match: { conversationId } },
			{ $sort: { createdAt: 1 } },
			{ $lookup: { from: 'members', localField: 'senderId', foreignField: '_id', as: 'senderData' } },
			{ $unwind: { path: '$senderData', preserveNullAndEmptyArrays: true } },
		]);
		return result as Message[];
	}
}
