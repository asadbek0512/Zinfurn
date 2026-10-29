import { Schema } from 'mongoose';
import {
	ProductType,
	ProductStatus,
	ProductCategory,
	ProductMaterial,
	ProductColor,
	ProductCondition
} from '../libs/enums/product.enum';

const ProductSchema = new Schema(
	{
		productType: {
			type: String,
			enum: ProductType,
			required: true,
		},

		productStatus: {
			type: String,
			enum: ProductStatus,
			default: ProductStatus.ACTIVE,
		},

		productCategory: {
			type: String,
			enum: ProductCategory,
			required: true,
		},

		productMaterial: {
			type: String,
			enum: ProductMaterial,
			required: true,
		},

		productColor: {
			type: String,
			enum: ProductColor,
			required: true,
		},

		productSize: {
			type: String,
			// required: true,
		},

		productTitle: {
			type: String,
			required: true,
		},

		productPrice: {
			type: Number,
			required: true,
		},

		productSalePrice: {
			type: Number,
		},

		productIsOnSale: {
			type: Boolean,
			default: false,
		},

		// Zaxira miqdori. null/undefined = cheksiz (eski listinglar uchun), 0 = tugagan, past son = "oz qoldi"
		productStock: {
			type: Number,
		},

		// Sale oynasining boshlanishi — kelajakdagi sale'lar shu sana kelgunicha
		// mijozga ko'rinmaydi (flash sale navbatma-navbat almashishi uchun)
		productSaleStartsAt: {
			type: Date,
		},

		productSaleExpiresAt: {
			type: Date,
		},

		productViews: {
			type: Number,
			default: 0,
		},

		productLikes: {
			type: Number,
			default: 0,
		},

		productReviews: {
			type: Number,
			default: 0,
		},

		productRating: {
			type: Number,
			default: 0,
		},

		productSoldCount: {
			type: Number,
			default: 0,
		},

		productRank: {
			type: Number,
			default: 0,
		},

		productImages: {
			type: [String],
			required: true,
		},

		productArModel: {
			type: String,
		},

		productDesc: {
			type: String,
		},

		// Avtomatik tarjimalar: { uz: {title, desc}, en: {...}, ru, kr, ar }
		// Additive maydon — bo'lmasa frontend asl matnni ko'rsatadi
		productTranslations: {
			type: Schema.Types.Mixed,
			default: {},
		},

		productBarter: {
			type: Boolean,
			default: false,
		},

		productRent: {
			type: Boolean,
			default: false,
		},

		productInStock: {
			type: Boolean,
			default: true,
		},

		productCondition: {
			type: String,
			enum: ProductCondition,
			required: true,
		},

		productBrand: {
			type: String,
		},

		productOriginCountry: {
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
	{ timestamps: true, collection: 'products' },
);

ProductSchema.index(
	{
		productType: 1,
		productCategory: 1,
		productTitle: 1,
		productPrice: 1,
	},
	{ unique: true },
);

export default ProductSchema;