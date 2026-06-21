import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { WithoutGuard } from '../auth/guards/without.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { ShapeIntoMongoObjectId } from '../../libs/config';
import { MemberType } from '../../libs/enums/member.enum';
import { Review, ReviewReactionResult, Reviews, ReviewSummary } from '../../libs/dto/review/review';
import { CreateReviewInput, ReviewsInquiry } from '../../libs/dto/review/review.input';
import { ReviewUpdate } from '../../libs/dto/review/review.update';
import { ReviewReaction } from '../../libs/enums/review.enum';
import { ReviewService } from './review.service';

@Resolver()
export class ReviewResolver {
	constructor(private readonly reviewService: ReviewService) {}

	@UseGuards(AuthGuard)
	@Mutation(() => Review)
	public async createReview(
		@Args('input') input: CreateReviewInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Review> {
		console.log('Mutation: createReview');
		input.propertyId = ShapeIntoMongoObjectId(input.propertyId);
		input.orderId = ShapeIntoMongoObjectId(input.orderId);
		return this.reviewService.createReview(memberId, input);
	}

	@UseGuards(WithoutGuard)
	@Query(() => Reviews)
	public async getPropertyReviews(
		@Args('input') input: ReviewsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Reviews> {
		console.log('Query: getPropertyReviews');
		input.search.propertyId = ShapeIntoMongoObjectId(input.search.propertyId);
		return this.reviewService.getPropertyReviews(input, memberId);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => ReviewReactionResult)
	public async toggleReviewReaction(
		@Args('reviewId') reviewId: string,
		@Args('reaction', { type: () => ReviewReaction }) reaction: ReviewReaction,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<ReviewReactionResult> {
		console.log('Mutation: toggleReviewReaction');
		return this.reviewService.toggleReviewReaction(memberId, ShapeIntoMongoObjectId(reviewId), reaction);
	}

	@UseGuards(WithoutGuard)
	@Query(() => ReviewSummary)
	public async getPropertyReviewSummary(
		@Args('propertyId') propertyId: string,
	): Promise<ReviewSummary> {
		console.log('Query: getPropertyReviewSummary');
		return this.reviewService.getPropertyReviewSummary(ShapeIntoMongoObjectId(propertyId));
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Review)
	public async updateReview(
		@Args('input') input: ReviewUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Review> {
		console.log('Mutation: updateReview');
		input._id = ShapeIntoMongoObjectId(input._id);
		return this.reviewService.updateReview(memberId, input);
	}

	/** ADMIN **/

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Review)
	public async removeReviewByAdmin(@Args('reviewId') reviewId: string): Promise<Review> {
		console.log('Mutation: removeReviewByAdmin');
		return this.reviewService.removeReviewByAdmin(ShapeIntoMongoObjectId(reviewId));
	}
}
