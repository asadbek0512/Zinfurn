import { Schema } from 'mongoose';
import { MessageStatus } from '../libs/enums/message.enum';

const MessageSchema = new Schema(
	{
		conversationId: { type: String, required: true, index: true },
		productId: { type: Schema.Types.ObjectId, required: false, ref: 'Product' },
		kind: { type: String, enum: ['PRODUCT', 'REPAIR'], default: 'PRODUCT' },
		senderId: { type: Schema.Types.ObjectId, required: true, ref: 'Member' },
		receiverId: { type: Schema.Types.ObjectId, required: true, ref: 'Member' },
		message: { type: String, required: true },
		messageStatus: { type: String, enum: MessageStatus, default: MessageStatus.WAIT },
	},
	{ timestamps: true, collection: 'messages' },
);

MessageSchema.index({ conversationId: 1, createdAt: 1 });

export default MessageSchema;
