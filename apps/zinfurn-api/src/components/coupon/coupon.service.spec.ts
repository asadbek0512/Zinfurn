import { BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { CouponService } from './coupon.service';
import { Coupon } from '../../libs/dto/coupon/coupon';
import { CouponStatus, CouponType } from '../../libs/enums/coupon.enum';

/**
 * Kupon testlari — chegirma pul bilan bog'liq, shuning uchun:
 *  - foiz/summa hisobi, 100% va buyurtmadan katta summa chegaralari
 *  - muddat, limit, minimal summa, faol emas holatlari
 *  - redeem: atomar limit guard yutqazsa xato
 */
describe('CouponService', () => {
	const DAY_MS = 24 * 60 * 60 * 1000;

	const makeCoupon = (overrides: Partial<Coupon> = {}): Partial<Coupon> => ({
		couponCode: 'SALE10',
		couponType: CouponType.PERCENT,
		couponValue: 10,
		couponStatus: CouponStatus.ACTIVE,
		minOrderAmount: 0,
		maxUses: 0,
		usedCount: 0,
		...overrides,
	});

	const makeService = (coupon: Partial<Coupon> | null, redeemed: Partial<Coupon> | null = coupon) => {
		const findOneAndUpdate = jest.fn(() => ({ exec: async () => redeemed }));
		const model = {
			findOne: jest.fn(() => ({ exec: async () => coupon })),
			findOneAndUpdate,
		} as unknown as Model<Coupon>;
		return { service: new CouponService(model), findOneAndUpdate };
	};

	it('foizli kupon: 10% chegirma to\'g\'ri hisoblanadi', async () => {
		const { service } = makeService(makeCoupon());
		const result = await service.validateCoupon('sale10', 200000);
		expect(result.valid).toBe(true);
		expect(result.discountAmount).toBe(20000);
		expect(result.finalTotal).toBe(180000);
	});

	it('foiz 100 dan oshsa ham chegirma buyurtma summasidan oshmaydi', async () => {
		const { service } = makeService(makeCoupon({ couponValue: 150 }));
		const result = await service.validateCoupon('SALE10', 50000);
		expect(result.discountAmount).toBe(50000);
		expect(result.finalTotal).toBe(0);
	});

	it('summali kupon buyurtmadan katta bo\'lsa — yakuniy summa manfiy bo\'lmaydi', async () => {
		const { service } = makeService(makeCoupon({ couponType: CouponType.FIXED, couponValue: 90000 }));
		const result = await service.validateCoupon('SALE10', 30000);
		expect(result.discountAmount).toBe(30000);
		expect(result.finalTotal).toBe(0);
	});

	it('topilmagan / faol emas / muddati o\'tgan / limiti tugagan kupon rad etiladi', async () => {
		const cases: (Partial<Coupon> | null)[] = [
			null,
			makeCoupon({ couponStatus: CouponStatus.PAUSED }),
			makeCoupon({ validUntil: new Date(Date.now() - DAY_MS) }),
			makeCoupon({ maxUses: 5, usedCount: 5 }),
		];
		for (const coupon of cases) {
			const { service } = makeService(coupon);
			const result = await service.validateCoupon('SALE10', 100000);
			expect(result.valid).toBe(false);
			expect(result.discountAmount).toBe(0);
			expect(result.finalTotal).toBe(100000);
		}
	});

	it('minimal buyurtma summasidan kam bo\'lsa rad etiladi', async () => {
		const { service } = makeService(makeCoupon({ minOrderAmount: 100000 }));
		const result = await service.validateCoupon('SALE10', 99999);
		expect(result.valid).toBe(false);
	});

	it('redeem: kod normalizatsiya qilinadi (trim + uppercase)', async () => {
		const { service } = makeService(makeCoupon());
		const result = await service.redeemCoupon('  sale10 ', 100000);
		expect(result).toEqual({ discountAmount: 10000, couponCode: 'SALE10' });
	});

	it('redeem: parallel so\'rov oxirgi foydalanishni olib qo\'ysa BadRequest', async () => {
		const { service } = makeService(makeCoupon({ maxUses: 1 }), null);
		await expect(service.redeemCoupon('SALE10', 100000)).rejects.toBeInstanceOf(BadRequestException);
	});

	it('redeem: yaroqsiz kupon usedCount\'ni oshirmaydi', async () => {
		const { service, findOneAndUpdate } = makeService(makeCoupon({ couponStatus: CouponStatus.PAUSED }));
		await expect(service.redeemCoupon('SALE10', 100000)).rejects.toBeInstanceOf(BadRequestException);
		expect(findOneAndUpdate).not.toHaveBeenCalled();
	});
});
