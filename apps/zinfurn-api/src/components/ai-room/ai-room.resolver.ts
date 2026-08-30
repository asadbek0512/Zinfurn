import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { AiRoomService } from './ai-room.service';
import { AiQuotaService } from './ai-quota.service';
import { GenerateRoomImageInput, RoomAnalysisInput } from '../../libs/dto/ai-room/ai-room.input';
import { GeneratedRoomImage, RoomAnalysisResult } from '../../libs/dto/ai-room/ai-room';
import { WithoutGuard } from '../auth/guards/without.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';

@Resolver()
export class AiRoomResolver {
	constructor(
		private readonly aiRoomService: AiRoomService,
		private readonly aiQuotaService: AiQuotaService,
	) {}

	@UseGuards(WithoutGuard)
	@Mutation((returns) => RoomAnalysisResult)
	public async analyzeRoom(
		@Args('input') input: RoomAnalysisInput,
		@AuthMember('_id') memberId: ObjectId,
		@Context() ctx: any,
	): Promise<RoomAnalysisResult> {
		this.aiQuotaService.consume(memberId?.toString(), this.resolveIp(ctx));
		return await this.aiRoomService.analyzeRoom(input);
	}

	@UseGuards(WithoutGuard)
	@Mutation((returns) => GeneratedRoomImage)
	public async generateRoomImage(
		@Args('input') input: GenerateRoomImageInput,
		@AuthMember('_id') memberId: ObjectId,
		@Context() ctx: any,
	): Promise<GeneratedRoomImage> {
		this.aiQuotaService.consume(memberId?.toString(), this.resolveIp(ctx));
		return await this.aiRoomService.generateRoomImage(input);
	}

	// Nginx orqasida turgani uchun avval x-forwarded-for tekshiriladi
	private resolveIp(ctx: any): string | undefined {
		const req = ctx?.req;
		const forwarded = req?.headers?.['x-forwarded-for'];
		if (typeof forwarded === 'string' && forwarded.length) return forwarded.split(',')[0].trim();
		return req?.ip || req?.socket?.remoteAddress;
	}
}
