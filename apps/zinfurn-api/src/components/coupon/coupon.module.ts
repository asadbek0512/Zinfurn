import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import CouponSchema from '../../schemas/Coupon.model';
import { CouponResolver } from './coupon.resolver';
import { CouponService } from './coupon.service';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Coupon', schema: CouponSchema }]), AuthModule],
	providers: [CouponResolver, CouponService],
	exports: [CouponService],
})
export class CouponModule {}
