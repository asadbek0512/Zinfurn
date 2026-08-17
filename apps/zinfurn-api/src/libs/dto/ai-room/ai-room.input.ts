import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class RoomAnalysisInput {
	@IsNotEmpty()
	@IsString()
	@Field(() => String)
	imageBase64: string;

	@IsOptional()
	@IsString()
	@Field(() => String, { nullable: true })
	mimeType?: string; // masalan: 'image/jpeg', 'image/png'
}
