import { BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { CouponService } from './coupon.service';
import { Coupon } from '../../libs/dto/coupon/coupon';
import { CouponStatus, CouponType } from '../../libs/enums/coupon.enum';

/**
 * Kupon testlari — chegirma faqat serverda hisoblanadi:
 *  - foiz/fiks chegirma, 100% va summa chegarasi
 *  - muddati, limiti, statusi, minimal summa tekshiruvi
 *  - atomar redeem (limit talashuvi) va release
 */
describe('CouponService', () => {
	const DAY_MS = 24 * 60 * 60 * 1000;
	const baseCoupon = {
		couponCode: 'SALE10',
		couponType: CouponType.PERCENT,
		couponValue: 10,
		couponStatus: CouponStatus.ACTIVE,
		maxUses: 0,
		usedCount: 0,
		minOrderAmount: 0,
	};

	const makeService = (coupon: object | null, redeemed: object | null = coupon) => {
		const findOne = jest.fn((_filter: object) => ({ exec: async () => coupon }));
		const findOneAndUpdate = jest.fn((_filter: object, _update: object) => ({ exec: async () => redeemed }));
		const updateOne = jest.fn((_filter: object, _update: object) => ({ exec: async () => undefined }));
		const model = { findOne, findOneAndUpdate, updateOne } as unknown as Model<Coupon>;
		return { service: new CouponService(model), findOne, findOneAndUpdate, updateOne };
	};

	it('foizli kupon: chegirma va yakuniy summa', async () => {
		const { service } = makeService(baseCoupon);
		const result = await service.validateCoupon('SALE10', 200);
		expect(result).toMatchObject({ valid: true, discountAmount: 20, finalTotal: 180, couponCode: 'SALE10' });
	});

	it("kod bo'shliq va kichik harf bilan kelsa ham normallashtiriladi", async () => {
		const { service, findOne } = makeService(baseCoupon);
		await service.validateCoupon('  sale10 ', 100);
		expect(findOne.mock.calls[0][0]).toEqual({ couponCode: 'SALE10' });
	});

	it('foiz 100 dan oshmaydi', async () => {
		const { service } = makeService({ ...baseCoupon, couponValue: 150 });
		const result = await service.validateCoupon('SALE10', 80);
		expect(result.discountAmount).toBe(80);
		expect(result.finalTotal).toBe(0);
	});

	it('fiks kupon buyurtma summasidan oshmaydi', async () => {
		const { service } = makeService({ ...baseCoupon, couponType: CouponType.FIXED, couponValue: 500 });
		const result = await service.validateCoupon('SALE10', 120);
		expect(result.discountAmount).toBe(120);
		expect(result.finalTotal).toBe(0);
	});

	it.each([
		['topilmadi', null],
		['faol emas', { ...baseCoupon, couponStatus: CouponStatus.PAUSED }],
		['muddati tugagan', { ...baseCoupon, validUntil: new Date(Date.now() - DAY_MS) }],
		['limiti tugagan', { ...baseCoupon, maxUses: 5, usedCount: 5 }],
		['minimal buyurtma', { ...baseCoupon, minOrderAmount: 1000 }],
	])('yaroqsiz kupon: %s', async (reason, coupon) => {
		const { service } = makeService(coupon);
		const result = await service.validateCoupon('SALE10', 100);
		expect(result.valid).toBe(false);
		expect(result.message).toContain(reason);
		expect(result.discountAmount).toBe(0);
		expect(result.finalTotal).toBe(100);
	});

	it('redeem: atomar limit sharti bilan usedCount++', async () => {
		const { service, findOneAndUpdate } = makeService(baseCoupon);
		const result = await service.redeemCoupon('SALE10', 200);
		expect(result).toEqual({ discountAmount: 20, couponCode: 'SALE10' });
		const [filter, update] = findOneAndUpdate.mock.calls[0];
		expect(filter).toMatchObject({ couponCode: 'SALE10', couponStatus: CouponStatus.ACTIVE });
		expect(filter).toHaveProperty('$or');
		expect(update).toEqual({ $inc: { usedCount: 1 } });
	});

	it("redeem: oxirgi foydalanishni boshqa buyurtma yutib olsa rad etiladi", async () => {
		const { service } = makeService({ ...baseCoupon, maxUses: 1 }, null);
		await expect(service.redeemCoupon('SALE10', 200)).rejects.toThrow('limiti tugagan');
	});

	it("redeem: yaroqsiz kupon DB'ni o'zgartirmaydi", async () => {
		const { service, findOneAndUpdate } = makeService(null);
		await expect(service.redeemCoupon('NOPE', 200)).rejects.toBeInstanceOf(BadRequestException);
		expect(findOneAndUpdate).not.toHaveBeenCalled();
	});

	it('release: usedCount faqat 0 dan katta bo\'lsa kamayadi', async () => {
		const { service, updateOne } = makeService(baseCoupon);
		await service.releaseCoupon('SALE10');
		expect(updateOne).toHaveBeenCalledWith({ couponCode: 'SALE10', usedCount: { $gt: 0 } }, { $inc: { usedCount: -1 } });
	});
});
