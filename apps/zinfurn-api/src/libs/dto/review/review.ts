import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { ReviewStatus } from '../../enums/review.enum';
import { Member, TotalCounter } from '../member/member';

@ObjectType()
export class Review {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => String)
	propertyId: ObjectId;

	@Field(() => String)
	orderId: ObjectId;

	@Field(() => Int)
	reviewRating: number;

	@Field(() => String)
	reviewContent: string;

	@Field(() => [String])
	reviewImages: string[];

	@Field(() => ReviewStatus)
	reviewStatus: ReviewStatus;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	/** from aggregation **/
	@Field(() => Member, { nullable: true })
	memberData?: Member;
}

@ObjectType()
export class ReviewSummary {
	@Field(() => Float)
	averageRating: number;

	@Field(() => Int)
	totalReviews: number;
}

@ObjectType()
export class Reviews {
	@Field(() => [Review])
	list: Review[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
