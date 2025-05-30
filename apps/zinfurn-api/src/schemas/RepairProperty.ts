import { Schema } from 'mongoose';
import { RepairPropertyStatus, RepairPropertyType } from '../libs/enums/repairProperty.enum';

const RepairSchema = new Schema(
  {
    repairPropertyType: {
      type: String,
      enum: RepairPropertyType,
      required: true,
    },

    repairPropertyStatus: {
      type: String,
      enum: RepairPropertyStatus,
      default: RepairPropertyStatus.ACTIVE,
    },

    repairPropertyAddress: {
      type: String,
      required: true,
    },

    repairPropertyDescription: {
      type: String,
      required: true,
    },

    repairPropertyImages: {
      type: [String],
      required: false,
    },

    repairPropertyViews: {
      type: Number,
      default: 0,
    },

    repairPropertyLikes: {
      type: Number,
      default: 0,
    },

    repairPropertyComments: {
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
