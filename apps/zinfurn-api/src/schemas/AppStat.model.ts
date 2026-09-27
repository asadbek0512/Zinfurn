import { Schema } from 'mongoose';
import { AppPlatform } from '../libs/enums/app-stat.enum';

const AppStatSchema = new Schema(
	{
		platform: {
			type: String,
			enum: AppPlatform,
			required: true,
			unique: true,
		},

		downloads: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true, collection: 'appStats' },
);

export default AppStatSchema;
