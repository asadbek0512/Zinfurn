import { BadRequestException } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { OrderService } from './order.service';
import { TelegramNotifyService } from './telegram-notify.service';
import { MailNotifyService } from './mail-notify.service';
import { CouponService } from '../coupon/coupon.service';
import { Order } from '../../libs/dto/order/order';
import { CreateOrderInput } from '../../libs/dto/order/order.input';
import { effectivePrice } from '../../libs/pricing';

/**
 * Buyurtma narxi testlari — client yuborgan narx/summa e'tiborga olinmasligi kerak:
 *  - narx, nom va summa DB'dagi mahsulotdan olinadi
 *  - faol flash sale narxi qo'llanadi
 *  - sotuvda bo'lmagan mahsulot rad etiladi
 *  - kupon server hisoblagan summaga qo'llanadi
 */
describe('OrderService.createOrder', () => {
	const MEMBER_ID = 'member1' as unknown as ObjectId;
	const DAY_MS = 24 * 60 * 60 * 1000;

	const sofa = { _id: 'p1', propertyTitle: 'Sofa', propertyImages: ['sofa.jpg'], propertyPrice: 500000 };
	const chair = {
		_id: 'p2',
		propertyTitle: 'Chair',
		propertyImages: ['chair.jpg'],
		propertyPrice: 100000,
		propertySalePrice: 80000,
		propertyIsOnSale: true,
	};

	const makeService = (properties: object[], discountAmount = 0) => {
		const create = jest.fn(async (doc: object) => ({ _id: 'o1', ...doc }));
		const orderModel = { create } as unknown as Model<Order>;
		const propertyModel = {
			find: jest.fn(() => ({ select: () => ({ lean: () => ({ exec: async () => properties }) }) })),
		} as unknown as Model<unknown>;
		const notify = { notifyCustomer: jest.fn(), notifyAdminNewOrder: jest.fn() };
		const redeemCoupon = jest.fn(async (couponCode: string) => ({ couponCode, discountAmount }));
		const service = new OrderService(
			orderModel,
			propertyModel,
			notify as unknown as TelegramNotifyService,
			notify as unknown as MailNotifyService,
			{ redeemCoupon } as unknown as CouponService,
		);
		// auto-progression taymerlari testda ishga tushmasin
		jest.spyOn(service as unknown as { scheduleAutoProgression: () => void }, 'scheduleAutoProgression').mockImplementation(() => undefined);
		return { service, create, redeemCoupon };
	};

	const makeInput = (overrides: Partial<CreateOrderInput> = {}): CreateOrderInput =>
		({
			orderItems: [
				{ propertyId: 'p1', propertyTitle: 'Fake', propertyImage: 'x.jpg', propertyPrice: 1, quantity: 2 },
				{ propertyId: 'p2', propertyTitle: 'Fake', propertyImage: 'x.jpg', propertyPrice: 1, quantity: 1 },
			],
			orderTotal: 3,
			...overrides,
		}) as unknown as CreateOrderInput;

	it('client narxi va summasi e\'tiborsiz — DB narxi va sale narxi ishlatiladi', async () => {
		const { service, create } = makeService([sofa, chair]);
		const order = await service.createOrder(MEMBER_ID, makeInput());
		expect(order.orderTotal).toBe(500000 * 2 + 80000);
		const saved = create.mock.calls[0][0] as unknown as CreateOrderInput;
		expect(saved.orderItems[0]).toMatchObject({ propertyTitle: 'Sofa', propertyImage: 'sofa.jpg', propertyPrice: 500000 });
		expect(saved.orderItems[1].propertyPrice).toBe(80000);
	});

	it('sotuvda bo\'lmagan (topilmagan) mahsulot bo\'lsa buyurtma rad etiladi', async () => {
		const { service, create } = makeService([sofa]);
		await expect(service.createOrder(MEMBER_ID, makeInput())).rejects.toBeInstanceOf(BadRequestException);
		expect(create).not.toHaveBeenCalled();
	});

	it('kupon server hisoblagan summaga qo\'llanadi', async () => {
		const { service, redeemCoupon } = makeService([sofa, chair], 50000);
		const order = await service.createOrder(MEMBER_ID, makeInput({ couponCode: 'SALE' }));
		expect(redeemCoupon).toHaveBeenCalledWith('SALE', 1080000);
		expect(order.orderTotal).toBe(1030000);
	});

	describe('effectivePrice', () => {
		const now = Date.now();

		it('sale yoqilmagan bo\'lsa asosiy narx', () => {
			expect(effectivePrice({ ...chair, propertyIsOnSale: false }, now)).toBe(100000);
		});

		it('sale hali boshlanmagan bo\'lsa asosiy narx', () => {
			expect(effectivePrice({ ...chair, propertySaleStartsAt: new Date(now + DAY_MS) }, now)).toBe(100000);
		});

		it('sale muddati tugagan bo\'lsa asosiy narx', () => {
			expect(effectivePrice({ ...chair, propertySaleExpiresAt: new Date(now - DAY_MS) }, now)).toBe(100000);
		});

		it('sale oynasi ochiq bo\'lsa sale narxi', () => {
			const window = { propertySaleStartsAt: new Date(now - DAY_MS), propertySaleExpiresAt: new Date(now + DAY_MS) };
			expect(effectivePrice({ ...chair, ...window }, now)).toBe(80000);
		});
	});
});
