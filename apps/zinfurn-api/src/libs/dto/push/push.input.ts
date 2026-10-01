import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { PushPlatform } from '../../enums/push.enum';

export const PUSH_TOKEN_MAX = 512;

@InputType()
export class PushTokenInput {
	@IsNotEmpty()
	@IsString()
	@MaxLength(PUSH_TOKEN_MAX)
	@Field(() => String)
	pushToken: string;

	@IsEnum(PushPlatform)
	@Field(() => PushPlatform)
	pushPlatform: PushPlatform;
}
