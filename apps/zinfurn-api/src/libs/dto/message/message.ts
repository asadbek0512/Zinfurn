import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { MessageStatus } from '../../enums/message.enum';
import { Member } from '../member/member';

@ObjectType()
export class Message {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => String)
	conversationId: string;

	@Field(() => String)
	propertyId: ObjectId;

	@Field(() => String)
	senderId: ObjectId;

	@Field(() => String)
	receiverId: ObjectId;

	@Field(() => String)
	message: string;

	@Field(() => MessageStatus)
	messageStatus: MessageStatus;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	/** from aggregation **/
	@Field(() => Member, { nullable: true })
	senderData?: Member;
}

@ObjectType()
export class Conversation {
	@Field(() => String)
	conversationId: string;

	@Field(() => String)
	propertyId: ObjectId;

	@Field(() => String, { nullable: true })
	propertyTitle?: string;

	@Field(() => String, { nullable: true })
	propertyImage?: string;

	@Field(() => String)
	lastMessage: string;

	@Field(() => Date)
	lastMessageAt: Date;

	@Field(() => Int)
	unreadCount: number;

	@Field(() => Member, { nullable: true })
	partner?: Member;
}
