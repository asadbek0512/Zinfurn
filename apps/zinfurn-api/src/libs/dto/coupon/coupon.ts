import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { CouponStatus, CouponType } from '../../enums/coupon.enum';

@ObjectType()
export class Coupon {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => String)
	couponCode: string;

	@Field(() => CouponType)
	couponType: CouponType;

	@Field(() => Number)
	couponValue: number;

	@Field(() => CouponStatus)
	couponStatus: CouponStatus;

	@Field(() => Int)
	maxUses: number;

	@Field(() => Int)
	usedCount: number;

	@Field(() => Number)
	minOrderAmount: number;

	@Field(() => Date, { nullable: true })
	validUntil?: Date;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}

/** Checkout'da kupon tekshiruv natijasi */
@ObjectType()
export class CouponValidation {
	@Field(() => Boolean)
	valid: boolean;

	@Field(() => String)
	message: string;

	@Field(() => Number)
	discountAmount: number;

	@Field(() => Number)
	finalTotal: number;

	@Field(() => String, { nullable: true })
	couponCode?: string;
}
