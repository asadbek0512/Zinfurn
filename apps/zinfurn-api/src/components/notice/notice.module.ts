import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NoticeResolver } from './notice.resolver';
import { NoticeService } from './notice.service';
import { AuthModule } from '../auth/auth.module';
import NoticeSchema from '../../schemas/Notice.model';
import { TranslationModule } from '../translation/translation.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Notice', schema: NoticeSchema }]),
		AuthModule,
		TranslationModule,
	],
	providers: [NoticeResolver, NoticeService],
	exports: [NoticeService],
})
export class NoticeModule {}