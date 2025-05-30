import { Module } from '@nestjs/common';
import { CommentResolver } from './comment.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import CommentSchema from '../../schemas/Comment.model';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { PropertyModule } from '../property/property.module';
import { BoardArticleModule } from '../board-article/board-article.module';
import { CommentService } from './comment.service';
import MemberSchema from '../../schemas/Member.model';
import { NotificationModule } from '../notification/notification.module';
import { RepairPropertyModule } from '../repair-property/repair-property.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Comment', schema: CommentSchema },
			{ name: 'Member', schema: MemberSchema },
		]),
		NotificationModule,
		AuthModule,
		MemberModule,
		PropertyModule,
		BoardArticleModule,
    RepairPropertyModule
	],
	providers: [CommentResolver, CommentService],
})
export class CommentModule {}
