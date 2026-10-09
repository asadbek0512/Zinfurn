import { Schema } from 'mongoose';
import { ViewGroup } from '../libs/enums/view.enum';

const LikeSchema = new Schema(
	{
		likeGroup: {
			type: String,
			enum: ViewGroup,
			required: true,
		},

		likeRefId: {
			type: Schema.Types.ObjectId,
			required: true,
		},
		
		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},
	},
	{ timestamps: true, collection: 'likes' },
);

LikeSchema.index({ memberId: 1, likeRefId: 1 }, { unique: true });
// findLikerIds: {likeGroup, likeRefId} bo'yicha qidiruv (bitta obyektni kim yoqtirgani) — collection scan'ni oldini oladi
LikeSchema.index({ likeRefId: 1, likeGroup: 1 });

export default LikeSchema;
