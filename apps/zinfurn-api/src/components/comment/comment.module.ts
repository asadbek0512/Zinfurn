import { Module } from '@nestjs/common';
import { CommentResolver } from './comment.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import CommentSchema from '../../schemas/Comment.model';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { ProductModule } from '../product/product.module';
import { BoardArticleModule } from '../board-article/board-article.module';
import { CommentService } from './comment.service';
import MemberSchema from '../../schemas/Member.model';
import { NotificationModule } from '../notification/notification.module';
import { RepairProductModule } from '../repair-product/repair-product.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Comment', schema: CommentSchema },
			{ name: 'Member', schema: MemberSchema },
		]),
		NotificationModule,
		AuthModule,
		MemberModule,
		ProductModule,
		BoardArticleModule,
    RepairProductModule
	],
	providers: [CommentResolver, CommentService],
})
export class CommentModule {}
