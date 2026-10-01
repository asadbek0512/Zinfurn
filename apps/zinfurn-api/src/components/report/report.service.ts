import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { ReportInput } from '../../libs/dto/report/report.input';
import { ShapeIntoMongoObjectId } from '../../libs/config';
import { Message } from '../../libs/enums/common_enum';

const DUPLICATE_KEY_CODE = 11000;

@Injectable()
export class ReportService {
	private readonly logger = new Logger(ReportService.name);

	constructor(@InjectModel('Report') private readonly reportModel: Model<unknown>) {}

	public async reportContent(reporterId: ObjectId, input: ReportInput): Promise<boolean> {
		try {
			await this.reportModel.create({
				...input,
				reportRefId: ShapeIntoMongoObjectId(input.reportRefId),
				reporterId,
			});
		} catch (err) {
			if (err?.code === DUPLICATE_KEY_CODE) throw new BadRequestException(Message.ALREADY_REPORTED);
			this.logger.error(`reportContent failed: ${err.message}`);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
		this.logger.warn(`New report ${input.reportGroup}/${input.reportRefId} (${input.reportReason})`);
		return true;
	}
}
