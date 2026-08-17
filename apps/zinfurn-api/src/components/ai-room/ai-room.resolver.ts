import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AiRoomService } from './ai-room.service';
import { RoomAnalysisInput } from '../../libs/dto/ai-room/ai-room.input';
import { RoomAnalysisResult } from '../../libs/dto/ai-room/ai-room';
import { WithoutGuard } from '../auth/guards/without.guard';

@Resolver()
export class AiRoomResolver {
	constructor(private readonly aiRoomService: AiRoomService) {}

	@UseGuards(WithoutGuard)
	@Mutation((returns) => RoomAnalysisResult)
	public async analyzeRoom(@Args('input') input: RoomAnalysisInput): Promise<RoomAnalysisResult> {
		return await this.aiRoomService.analyzeRoom(input);
	}
}
