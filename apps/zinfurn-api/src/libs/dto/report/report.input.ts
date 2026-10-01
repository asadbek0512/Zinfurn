import { Field, InputType } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { ReportGroup, ReportReason } from '../../enums/report.enum';

export const REPORT_DETAIL_MAX = 500;

@InputType()
export class ReportInput {
	@IsNotEmpty()
	@IsIn(Object.values(ReportGroup))
	@Field(() => ReportGroup)
	reportGroup: ReportGroup;

	@IsNotEmpty()
	@IsIn(Object.values(ReportReason))
	@Field(() => ReportReason)
	reportReason: ReportReason;

	@IsNotEmpty()
	@Field(() => String)
	reportRefId: string;

	@IsOptional()
	@Length(0, REPORT_DETAIL_MAX)
	@Field(() => String, { nullable: true })
	reportDetail?: string;
}
