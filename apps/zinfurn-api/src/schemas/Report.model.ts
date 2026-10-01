import { Schema } from 'mongoose';
import { ReportGroup, ReportReason, ReportStatus } from '../libs/enums/report.enum';

const ReportSchema = new Schema(
	{
		reportGroup: { type: String, enum: ReportGroup, required: true },
		reportReason: { type: String, enum: ReportReason, required: true },
		reportStatus: { type: String, enum: ReportStatus, default: ReportStatus.PENDING },
		reportDetail: { type: String, default: '' },
		reportRefId: { type: Schema.Types.ObjectId, required: true },
		reporterId: { type: Schema.Types.ObjectId, required: true },
	},
	{ timestamps: true, collection: 'reports' },
);

// Bir foydalanuvchi bitta kontentga bir marta shikoyat qiladi
ReportSchema.index({ reporterId: 1, reportGroup: 1, reportRefId: 1 }, { unique: true });

export default ReportSchema;
