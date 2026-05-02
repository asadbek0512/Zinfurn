import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import OrderSchema from '../../schemas/Order.model';
import PropertySchema from '../../schemas/Property.model';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Order', schema: OrderSchema },
			{ name: 'Property', schema: PropertySchema },
		]),
		AuthModule,
		MemberModule,
	],
	providers: [OrderResolver, OrderService],
	exports: [OrderService],
})
export class OrderModule {}
