import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Length, Max, Min } from 'class-validator';
import { ObjectId } from 'mongoose';
import { Direction } from '../../enums/common_enum';

@InputType()
export class CreateReviewInput {
	@IsNotEmpty()
	@Field(() => String)
	propertyId: ObjectId;

	@IsNotEmpty()
	@Field(() => String)
	orderId: ObjectId;

	@IsNotEmpty()
	@Min(1)
	@Max(5)
	@Field(() => Int)
	reviewRating: number;

	@IsNotEmpty()
	@Length(1, 1000)
	@Field(() => String)
	reviewContent: string;

	@IsOptional()
	@Field(() => [String], { nullable: true })
	reviewImages?: string[];

	memberId?: ObjectId;
}

@InputType()
class RISearch {
	@IsNotEmpty()
	@Field(() => String)
	propertyId: ObjectId;
}

@InputType()
export class ReviewsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(['createdAt', 'updatedAt', 'reviewRating'])
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => RISearch)
	search: RISearch;
}
