import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { Conversation, Message } from '../../libs/dto/message/message';
import { ReplyMessageInput, SendMessageInput, SendRepairRequestInput } from '../../libs/dto/message/message.input';
import { MessageService } from './message.service';

@Resolver()
export class MessageResolver {
	constructor(private readonly messageService: MessageService) {}

	@UseGuards(AuthGuard)
	@Mutation(() => Message)
	public async sendMessage(
		@Args('input') input: SendMessageInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Message> {
		return this.messageService.sendMessage(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Message)
	public async replyMessage(
		@Args('input') input: ReplyMessageInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Message> {
		return this.messageService.replyMessage(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Message)
	public async sendRepairRequest(
		@Args('input') input: SendRepairRequestInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Message> {
		return this.messageService.sendRepairRequest(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Query(() => [Conversation])
	public async getMyConversations(@AuthMember('_id') memberId: ObjectId): Promise<Conversation[]> {
		return this.messageService.getMyConversations(memberId);
	}

	@UseGuards(AuthGuard)
	@Query(() => [Message])
	public async getConversation(
		@Args('conversationId') conversationId: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Message[]> {
		return this.messageService.getConversation(memberId, conversationId);
	}
}
