import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CouponService } from './coupon.service';
import { Coupon, CouponValidation } from '../../libs/dto/coupon/coupon';
import { CouponCreateInput, CouponUpdateInput } from '../../libs/dto/coupon/coupon.input';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';

@Resolver()
export class CouponResolver {
	constructor(private readonly couponService: CouponService) {}

	/** Checkout'da kupon tekshirish (brute-force'dan throttle bilan himoyalangan) */
	@Throttle({ default: { limit: 15, ttl: 60000 } })
	@UseGuards(AuthGuard)
	@Query(() => CouponValidation)
	public async validateCoupon(
		@Args('couponCode') couponCode: string,
		@Args('orderTotal') orderTotal: number,
	): Promise<CouponValidation> {
		return this.couponService.validateCoupon(couponCode, orderTotal);
	}

	/** ADMIN **/

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Coupon)
	public async createCoupon(@Args('input') input: CouponCreateInput): Promise<Coupon> {
		return this.couponService.createCoupon(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Coupon)
	public async updateCouponByAdmin(@Args('input') input: CouponUpdateInput): Promise<Coupon> {
		return this.couponService.updateCouponByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => [Coupon])
	public async getAllCouponsByAdmin(): Promise<Coupon[]> {
		return this.couponService.getAllCouponsByAdmin();
	}
}
