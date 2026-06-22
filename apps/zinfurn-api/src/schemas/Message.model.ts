import { Schema } from 'mongoose';
import { MessageStatus } from '../libs/enums/message.enum';

const MessageSchema = new Schema(
	{
		conversationId: { type: String, required: true, index: true },
		propertyId: { type: Schema.Types.ObjectId, required: true, ref: 'Property' },
		senderId: { type: Schema.Types.ObjectId, required: true, ref: 'Member' },
		receiverId: { type: Schema.Types.ObjectId, required: true, ref: 'Member' },
		message: { type: String, required: true },
		messageStatus: { type: String, enum: MessageStatus, default: MessageStatus.WAIT },
	},
	{ timestamps: true, collection: 'messages' },
);

MessageSchema.index({ conversationId: 1, createdAt: 1 });

export default MessageSchema;
