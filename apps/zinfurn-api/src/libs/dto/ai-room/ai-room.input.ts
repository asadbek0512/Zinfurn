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

	@IsOptional()
	@IsString()
	@Field(() => String, { nullable: true })
	userRequest?: string; // masalan: "shu xonaga mos krovat qo'yib ber"
}

@InputType()
export class GenerateRoomImageInput {
	@IsNotEmpty()
	@IsString()
	@Field(() => String)
	roomImageBase64: string;

	@IsOptional()
	@IsString()
	@Field(() => String, { nullable: true })
	mimeType?: string; // masalan: 'image/jpeg', 'image/png'

	@IsNotEmpty()
	@IsString()
	@Field(() => String)
	productId: string; // xonaga qo'yiladigan tanlangan mahsulot
}
