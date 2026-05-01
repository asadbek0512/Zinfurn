import { Schema } from 'mongoose';
import { ReviewStatus } from '../libs/enums/review.enum';

const ReviewSchema = new Schema(
	{
		memberId: { type: Schema.Types.ObjectId, required: true, ref: 'Member' },
		propertyId: { type: Schema.Types.ObjectId, required: true, ref: 'Property' },
		orderId: { type: Schema.Types.ObjectId, required: true, ref: 'Order' },
		reviewRating: { type: Number, required: true, min: 1, max: 5 },
		reviewContent: { type: String, required: true },
		reviewImages: { type: [String], default: [] },
		reviewStatus: { type: String, enum: ReviewStatus, default: ReviewStatus.ACTIVE },
	},
	{ timestamps: true, collection: 'reviews' },
);

ReviewSchema.index({ memberId: 1, propertyId: 1, orderId: 1 }, { unique: true });

export default ReviewSchema;
