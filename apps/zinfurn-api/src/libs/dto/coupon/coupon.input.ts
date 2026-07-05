import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { CouponStatus, CouponType } from '../../enums/coupon.enum';

@InputType()
export class CouponCreateInput {
	@IsNotEmpty()
	@Length(3, 24)
	@Field(() => String)
	couponCode: string;

	@Field(() => CouponType)
	couponType: CouponType;

	@Min(1)
	@Field(() => Number)
	couponValue: number;

	@IsOptional()
	@Min(0)
	@Field(() => Int, { nullable: true })
	maxUses?: number;

	@IsOptional()
	@Min(0)
	@Field(() => Number, { nullable: true })
	minOrderAmount?: number;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	validUntil?: Date;
}

@InputType()
export class CouponUpdateInput {
	@IsNotEmpty()
	@Field(() => String)
	_id: string;

	@IsOptional()
	@Field(() => CouponStatus, { nullable: true })
	couponStatus?: CouponStatus;

	@IsOptional()
	@Min(0)
	@Field(() => Int, { nullable: true })
	maxUses?: number;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	validUntil?: Date;
}
