import { Schema } from 'mongoose';
import { RepairProductStatus, RepairProductType } from '../libs/enums/repairProduct.enum';

const RepairSchema = new Schema(
  {
    repairProductType: {
      type: String,
      enum: RepairProductType,
      required: true,
    },

    repairProductStatus: {
      type: String,
      enum: RepairProductStatus,
      default: RepairProductStatus.ACTIVE,
    },

    repairProductAddress: {
      type: String,
      required: true,
    },

    repairProductDescription: {
      type: String,
      required: true,
    },

    repairProductImages: {
      type: [String],
      required: false,
    },

    // Avtomatik tarjimalar: { uz: {title, desc}, en, ru, kr, ar }. Additive.
    repairProductTranslations: {
      type: Schema.Types.Mixed,
      default: {},
    },

    repairProductViews: {
      type: Number,
      default: 0,
    },

    repairProductLikes: {
      type: Number,
      default: 0,
    },

    repairProductComments: {
      type: Number,
      default: 0,
    },

    memberId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Member',
    },

    deletedAt: {
      type: Date,
    },

    constructedAt: {
      type: Date,
    },
  },
  { timestamps: true, collection: 'repair_requests' }
);

export default RepairSchema;
