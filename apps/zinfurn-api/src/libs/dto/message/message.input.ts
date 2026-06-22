import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';

@InputType()
export class SendMessageInput {
	@IsNotEmpty()
	@Field(() => String)
	propertyId: string;

	@IsNotEmpty()
	@Length(1, 2000)
	@Field(() => String)
	message: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	name?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	phone?: string;
}

@InputType()
export class ReplyMessageInput {
	@IsNotEmpty()
	@Field(() => String)
	conversationId: string;

	@IsNotEmpty()
	@Length(1, 2000)
	@Field(() => String)
	message: string;
}

@InputType()
export class SendRepairRequestInput {
	@IsNotEmpty()
	@Field(() => String)
	technicianId: string;

	@IsNotEmpty()
	@Length(1, 2000)
	@Field(() => String)
	message: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	address?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	phone?: string;
}
