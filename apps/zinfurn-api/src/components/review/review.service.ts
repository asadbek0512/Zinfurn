import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Review, ReviewReactionResult, Reviews, ReviewSummary } from '../../libs/dto/review/review';
import { CreateReviewInput, ReviewsInquiry } from '../../libs/dto/review/review.input';
import { ReviewUpdate } from '../../libs/dto/review/review.update';
import { ReviewReaction, ReviewStatus } from '../../libs/enums/review.enum';
import { OrderStatus } from '../../libs/enums/order.enum';
import { Message, Direction } from '../../libs/enums/common_enum';
import { T } from '../../libs/types/common';
import { lookupMember } from '../../libs/config';

@Injectable()
export class ReviewService {
	constructor(
		@InjectModel('Review') private readonly reviewModel: Model<Review>,
		@InjectModel('Order') private readonly orderModel: Model<any>,
		@InjectModel('Property') private readonly propertyModel: Model<any>,
	) {}

	public async createReview(memberId: ObjectId, input: CreateReviewInput): Promise<Review> {
		const order = await this.orderModel.findOne({
			_id: input.orderId,
			memberId,
			orderStatus: OrderStatus.CONFIRMED,
		});
		if (!order) throw new BadRequestException('Order must be confirmed before writing a review');

		const existing = await this.reviewModel.findOne({
			memberId,
			propertyId: input.propertyId,
			orderId: input.orderId,
		});
		if (existing) throw new BadRequestException('You already reviewed this order item');

		input.memberId = memberId;
		try {
			const review = await this.reviewModel.create(input);

			// recalculate average rating and update counters
			const avgResult = await this.reviewModel.aggregate([
				{ $match: { propertyId: input.propertyId, reviewStatus: ReviewStatus.ACTIVE } },
				{ $group: { _id: null, avg: { $avg: '$reviewRating' } } },
			]).exec();
			const newRating = avgResult[0] ? Math.round(avgResult[0].avg * 10) / 10 : 0;

			await this.propertyModel.findByIdAndUpdate(input.propertyId, {
				$inc: { propertyReviews: 1 },
				propertyRating: newRating,
			});
			return review;
		} catch (err) {
			console.error('ReviewService.createReview error:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getPropertyReviews(input: ReviewsInquiry, memberId?: ObjectId): Promise<Reviews> {
		const { page, limit, sort, direction, search } = input;
		const match: T = {
			propertyId: search.propertyId,
			reviewStatus: ReviewStatus.ACTIVE,
		};
		const sortBy: T = { [sort ?? 'createdAt']: direction ?? Direction.DESC };

		const result = await this.reviewModel
			.aggregate([
				{ $match: match },
				{ $sort: sortBy },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							lookupMember,
							{ $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } },
							{
								$addFields: {
									likesCount: { $size: { $ifNull: ['$reviewLikes', []] } },
									dislikesCount: { $size: { $ifNull: ['$reviewDislikes', []] } },
									myReaction: {
										$cond: [
											{ $in: [memberId ?? null, { $ifNull: ['$reviewLikes', []] }] },
											ReviewReaction.LIKE,
											{
												$cond: [
													{ $in: [memberId ?? null, { $ifNull: ['$reviewDislikes', []] }] },
													ReviewReaction.DISLIKE,
													null,
												],
											},
										],
									},
								},
							},
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		return result[0] as Reviews;
	}

	public async toggleReviewReaction(
		memberId: ObjectId,
		reviewId: ObjectId,
		reaction: ReviewReaction,
	): Promise<ReviewReactionResult> {
		const review = await this.reviewModel.findOne({ _id: reviewId, reviewStatus: ReviewStatus.ACTIVE });
		if (!review) throw new BadRequestException(Message.NO_DATA_FOUND);

		const me = String(memberId);
		let likes = (review.get('reviewLikes') ?? []).map((id: ObjectId) => String(id));
		let dislikes = (review.get('reviewDislikes') ?? []).map((id: ObjectId) => String(id));

		if (reaction === ReviewReaction.LIKE) {
			if (likes.includes(me)) {
				likes = likes.filter((id) => id !== me);
			} else {
				likes.push(me);
				dislikes = dislikes.filter((id) => id !== me);
			}
		} else {
			if (dislikes.includes(me)) {
				dislikes = dislikes.filter((id) => id !== me);
			} else {
				dislikes.push(me);
				likes = likes.filter((id) => id !== me);
			}
		}

		await this.reviewModel.findByIdAndUpdate(reviewId, {
			reviewLikes: likes,
			reviewDislikes: dislikes,
		});

		return {
			_id: reviewId,
			likesCount: likes.length,
			dislikesCount: dislikes.length,
			myReaction: likes.includes(me)
				? ReviewReaction.LIKE
				: dislikes.includes(me)
					? ReviewReaction.DISLIKE
					: undefined,
		};
	}

	public async getPropertyReviewSummary(propertyId: ObjectId): Promise<ReviewSummary> {
		const result = await this.reviewModel
			.aggregate([
				{ $match: { propertyId, reviewStatus: ReviewStatus.ACTIVE } },
				{
					$group: {
						_id: null,
						averageRating: { $avg: '$reviewRating' },
						totalReviews: { $sum: 1 },
						r1: { $sum: { $cond: [{ $eq: ['$reviewRating', 1] }, 1, 0] } },
						r2: { $sum: { $cond: [{ $eq: ['$reviewRating', 2] }, 1, 0] } },
						r3: { $sum: { $cond: [{ $eq: ['$reviewRating', 3] }, 1, 0] } },
						r4: { $sum: { $cond: [{ $eq: ['$reviewRating', 4] }, 1, 0] } },
						r5: { $sum: { $cond: [{ $eq: ['$reviewRating', 5] }, 1, 0] } },
					},
				},
			])
			.exec();

		if (!result[0]) return { averageRating: 0, totalReviews: 0, ratingDistribution: [] };
		const r = result[0];
		return {
			averageRating: Math.round(r.averageRating * 10) / 10,
			totalReviews: r.totalReviews,
			ratingDistribution: [
				{ star: 5, count: r.r5 },
				{ star: 4, count: r.r4 },
				{ star: 3, count: r.r3 },
				{ star: 2, count: r.r2 },
				{ star: 1, count: r.r1 },
			],
		};
	}

	public async updateReview(memberId: ObjectId, input: ReviewUpdate): Promise<Review> {
		const review = await this.reviewModel.findOne({ _id: input._id, memberId });
		if (!review) throw new BadRequestException(Message.NO_DATA_FOUND);
		return this.reviewModel.findByIdAndUpdate(input._id, input, { new: true }) as unknown as Review;
	}

	/** ADMIN **/
	public async removeReviewByAdmin(reviewId: ObjectId): Promise<Review> {
		return this.reviewModel.findByIdAndUpdate(
			reviewId,
			{ reviewStatus: ReviewStatus.DELETE },
			{ new: true },
		) as unknown as Review;
	}
}
