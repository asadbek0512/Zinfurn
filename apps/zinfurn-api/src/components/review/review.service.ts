import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Review, Reviews, ReviewSummary } from '../../libs/dto/review/review';
import { CreateReviewInput, ReviewsInquiry } from '../../libs/dto/review/review.input';
import { ReviewUpdate } from '../../libs/dto/review/review.update';
import { ReviewStatus } from '../../libs/enums/review.enum';
import { OrderStatus } from '../../libs/enums/order.enum';
import { Message, Direction } from '../../libs/enums/common_enum';
import { T } from '../../libs/types/common';
import { lookupMember } from '../../libs/config';

@Injectable()
export class ReviewService {
	constructor(
		@InjectModel('Review') private readonly reviewModel: Model<Review>,
		@InjectModel('Order') private readonly orderModel: Model<any>,
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
			return await this.reviewModel.create(input);
		} catch (err) {
			console.log('ReviewService.createReview error:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getPropertyReviews(input: ReviewsInquiry): Promise<Reviews> {
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
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		return result[0] as Reviews;
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
					},
				},
			])
			.exec();

		if (!result[0]) return { averageRating: 0, totalReviews: 0 };
		return { averageRating: Math.round(result[0].averageRating * 10) / 10, totalReviews: result[0].totalReviews };
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
