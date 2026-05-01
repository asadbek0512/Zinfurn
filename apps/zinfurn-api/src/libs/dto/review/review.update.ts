import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length, Max, Min } from 'class-validator';
import { ObjectId } from 'mongoose';

@InputType()
export class ReviewUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Min(1)
	@Max(5)
	@Field(() => Int, { nullable: true })
	reviewRating?: number;

	@IsOptional()
	@Length(1, 1000)
	@Field(() => String, { nullable: true })
	reviewContent?: string;

	@IsOptional()
	@Field(() => [String], { nullable: true })
	reviewImages?: string[];
}
