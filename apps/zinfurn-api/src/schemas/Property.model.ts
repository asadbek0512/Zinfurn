import { Schema } from 'mongoose';
import {
	PropertyType,
	PropertyStatus,
	PropertyCategory,
	PropertyMaterial,
	PropertyColor,
	PropertyCondition
} from '../libs/enums/property.enum';

const PropertySchema = new Schema(
	{
		propertyType: {
			type: String,
			enum: PropertyType,
			required: true,
		},

		propertyStatus: {
			type: String,
			enum: PropertyStatus,
			default: PropertyStatus.ACTIVE,
		},

		propertyCategory: {
			type: String,
			enum: PropertyCategory,
			required: true,
		},

		propertyMaterial: {
			type: String,
			enum: PropertyMaterial,
			required: true,
		},

		propertyColor: {
			type: String,
			enum: PropertyColor,
			required: true,
		},

		propertySize: {
			type: String,
			// required: true,
		},

		propertyTitle: {
			type: String,
			required: true,
		},

		propertyPrice: {
			type: Number,
			required: true,
		},

		propertySalePrice: {
			type: Number,
		},

		propertyIsOnSale: {
			type: Boolean,
			default: false,
		},

		propertySaleExpiresAt: {
			type: Date,
		},

		propertyViews: {
			type: Number,
			default: 0,
		},

		propertyLikes: {
			type: Number,
			default: 0,
		},

		propertyComments: {
			type: Number,
			default: 0,
		},

		propertyRank: {
			type: Number,
			default: 0,
		},

		propertyImages: {
			type: [String],
			required: true,
		},

		propertyDesc: {
			type: String,
		},

		propertyBarter: {
			type: Boolean,
			default: false,
		},

		propertyRent: {
			type: Boolean,
			default: false,
		},

		propertyInStock: {
			type: Boolean,
			default: true,
		},

		propertyCondition: {
			type: String,
			enum: PropertyCondition,
			required: true,
		},

		propertyBrand: {
			type: String,
		},

		propertyOriginCountry: {
			type: String,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		soldAt: {
			type: Date,
		},

		deletedAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'properties' },
);

PropertySchema.index(
	{
		propertyType: 1,
		propertyCategory: 1,
		propertyTitle: 1,
		propertyPrice: 1,
	},
	{ unique: true },
);

export default PropertySchema;