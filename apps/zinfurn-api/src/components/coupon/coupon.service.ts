import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon, CouponValidation } from '../../libs/dto/coupon/coupon';
import { CouponCreateInput, CouponUpdateInput } from '../../libs/dto/coupon/coupon.input';
import { CouponStatus, CouponType } from '../../libs/enums/coupon.enum';
import { Message } from '../../libs/enums/common_enum';

@Injectable()
export class CouponService {
	private readonly logger = new Logger(CouponService.name);

	constructor(@InjectModel('Coupon') private readonly couponModel: Model<Coupon>) {}

	/** Kupon holatini tekshirish (o'zgartirmasdan) — checkout'da "Apply" bosilganda */
	public async validateCoupon(code: string, orderTotal: number): Promise<CouponValidation> {
		const fail = (message: string): CouponValidation => ({
			valid: false,
			message,
			discountAmount: 0,
			finalTotal: orderTotal,
		});

		const coupon = await this.couponModel.findOne({ couponCode: code.trim().toUpperCase() }).exec();
		if (!coupon) return fail('Kupon topilmadi');
		if (coupon.couponStatus !== CouponStatus.ACTIVE) return fail('Kupon faol emas');
		if (coupon.validUntil && coupon.validUntil.getTime() < Date.now()) return fail('Kupon muddati tugagan');
		if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) return fail('Kupon limiti tugagan');
		if (orderTotal < (coupon.minOrderAmount || 0)) {
			return fail(`Bu kupon uchun minimal buyurtma: ${coupon.minOrderAmount}`);
		}

		const discountAmount = this.calcDiscount(coupon, orderTotal);
		return {
			valid: true,
			message: 'Kupon qo\'llandi',
			discountAmount,
			finalTotal: Math.max(0, orderTotal - discountAmount),
			couponCode: coupon.couponCode,
		};
	}

	/**
	 * Buyurtma yaratishda kuponni ATOMAR ishlatish: limit sharti bilan usedCount++.
	 * Ikkita parallel buyurtma oxirgi foydalanishni talashsa — faqat bittasi yutadi.
	 * Xato bo'lsa throw — order.service xabarni foydalanuvchiga qaytaradi.
	 */
	public async redeemCoupon(code: string, orderTotal: number): Promise<{ discountAmount: number; couponCode: string }> {
		const check = await this.validateCoupon(code, orderTotal);
		if (!check.valid) throw new BadRequestException(check.message);

		const filter: any = {
			couponCode: check.couponCode,
			couponStatus: CouponStatus.ACTIVE,
		};
		// limitli kuponda atomar guard: usedCount < maxUses
		const redeemed = await this.couponModel
			.findOneAndUpdate(
				{ ...filter, $or: [{ maxUses: 0 }, { $expr: { $lt: ['$usedCount', '$maxUses'] } }] },
				{ $inc: { usedCount: 1 } },
				{ new: true },
			)
			.exec();
		if (!redeemed) throw new BadRequestException('Kupon limiti tugagan');

		return { discountAmount: check.discountAmount, couponCode: check.couponCode as string };
	}

	private calcDiscount(coupon: Coupon, orderTotal: number): number {
		if (coupon.couponType === CouponType.PERCENT) {
			return Math.round((orderTotal * Math.min(coupon.couponValue, 100)) / 100);
		}
		return Math.min(coupon.couponValue, orderTotal);
	}

	/** ADMIN **/

	public async createCoupon(input: CouponCreateInput): Promise<Coupon> {
		if (input.couponType === CouponType.PERCENT && input.couponValue > 100) {
			throw new BadRequestException('Foiz chegirma 100 dan oshmasin');
		}
		try {
			return await this.couponModel.create({ ...input, couponCode: input.couponCode.trim().toUpperCase() });
		} catch (err: any) {
			if (err?.code === 11000) throw new BadRequestException('Bunday kupon kodi allaqachon bor');
			this.logger.error(`createCoupon: ${err.message}`);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async updateCouponByAdmin(input: CouponUpdateInput): Promise<Coupon> {
		const { _id, ...update } = input;
		const result = await this.couponModel.findByIdAndUpdate(_id, update, { new: true }).exec();
		if (!result) throw new BadRequestException(Message.NO_DATA_FOUND);
		return result;
	}

	public async getAllCouponsByAdmin(): Promise<Coupon[]> {
		return this.couponModel.find().sort({ createdAt: -1 }).exec();
	}
}
