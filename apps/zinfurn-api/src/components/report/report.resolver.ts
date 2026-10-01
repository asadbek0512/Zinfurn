import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { ReportService } from './report.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ReportInput } from '../../libs/dto/report/report.input';

@Resolver()
export class ReportResolver {
	constructor(private readonly reportService: ReportService) {}

	@UseGuards(AuthGuard)
	@Mutation(() => Boolean)
	public async reportContent(@Args('input') input: ReportInput, @AuthMember('_id') memberId: ObjectId): Promise<boolean> {
		return this.reportService.reportContent(memberId, input);
	}
}
