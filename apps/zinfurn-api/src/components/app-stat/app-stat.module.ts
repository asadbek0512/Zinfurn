import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppStatResolver } from './app-stat.resolver';
import { AppStatService } from './app-stat.service';
import { AuthModule } from '../auth/auth.module';
import AppStatSchema from '../../schemas/AppStat.model';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'AppStat', schema: AppStatSchema }]), AuthModule],
	providers: [AppStatResolver, AppStatService],
})
export class AppStatModule {}
