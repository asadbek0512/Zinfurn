import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { CouponModule } from '../coupon/coupon.module';
import OrderSchema from '../../schemas/Order.model';
import MemberSchema from '../../schemas/Member.model';
import PropertySchema from '../../schemas/Property.model';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { TelegramNotifyService } from './telegram-notify.service';
import { MailNotifyService } from './mail-notify.service';
import { TossPaymentService } from './toss-payment.service';
import { PaymeService } from './payme.service';
import { ClickService } from './click.service';
import { PaymentController } from './payment.controller';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Order', schema: OrderSchema },
			{ name: 'Property', schema: PropertySchema },
			{ name: 'Member', schema: MemberSchema },
		]),
		AuthModule,
		MemberModule,
		CouponModule,
	],
	controllers: [PaymentController],
	providers: [OrderResolver, OrderService, TelegramNotifyService, MailNotifyService, TossPaymentService, PaymeService, ClickService],
	exports: [OrderService],
})
export class OrderModule {}
