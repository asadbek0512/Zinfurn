import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import ReportSchema from '../../schemas/Report.model';
import { AuthModule } from '../auth/auth.module';
import { ReportResolver } from './report.resolver';
import { ReportService } from './report.service';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Report', schema: ReportSchema }]), AuthModule],
	providers: [ReportResolver, ReportService],
})
export class ReportModule {}
