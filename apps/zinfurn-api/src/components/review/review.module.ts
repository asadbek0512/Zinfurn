import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import ReviewSchema from '../../schemas/Review.model';
import OrderSchema from '../../schemas/Order.model';
import { ReviewResolver } from './review.resolver';
import { ReviewService } from './review.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Review', schema: ReviewSchema },
			{ name: 'Order', schema: OrderSchema },
		]),
		AuthModule,
	],
	providers: [ReviewResolver, ReviewService],
	exports: [ReviewService],
})
export class ReviewModule {}
