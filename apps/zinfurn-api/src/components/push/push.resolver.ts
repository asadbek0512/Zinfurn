import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { PushTokenInput } from '../../libs/dto/push/push.input';
import { PushService } from './push.service';

@Resolver()
export class PushResolver {
	constructor(private readonly pushService: PushService) {}

	@UseGuards(AuthGuard)
	@Mutation(() => Boolean)
	public async registerPushToken(@Args('input') input: PushTokenInput, @AuthMember('_id') memberId: ObjectId): Promise<boolean> {
		return this.pushService.registerToken(memberId, input);
	}

	/** Logout'da chaqiriladi — token'ning o'zi kalit, shuning uchun auth shart emas */
	@Mutation(() => Boolean)
	public async unregisterPushToken(@Args('pushToken') pushToken: string): Promise<boolean> {
		return this.pushService.unregisterToken(pushToken);
	}
}
