import { Schema } from 'mongoose';
import { PushPlatform } from '../libs/enums/push.enum';

/** Mobil app qurilmasining push token'i (APNs — iOS, FCM — Android) */
const PushDeviceSchema = new Schema(
	{
		memberId: { type: Schema.Types.ObjectId, required: true, ref: 'Member', index: true },
		pushToken: { type: String, required: true, unique: true },
		pushPlatform: { type: String, enum: PushPlatform, required: true },
	},
	{ timestamps: true, collection: 'pushDevices' },
);

export default PushDeviceSchema;
