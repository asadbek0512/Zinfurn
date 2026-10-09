import { OrderStatus } from '../../libs/enums/order.enum';
import { BadRequestException } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { OrderService } from './order.service';
import { TelegramNotifyService } from './telegram-notify.service';
import { MailNotifyService } from './mail-notify.service';
import { CouponService } from '../coupon/coupon.service';
import { TossPaymentService } from './toss-payment.service';
import { PushService } from '../push/push.service';
import { PaymentMethod, PaymentStatus } from '../../libs/enums/payment.enum';
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

	const makeService = (properties: object[], discountAmount = 0, storedOrder: object | null = null) => {
		const create = jest.fn(async (doc: object) => ({ _id: 'o1', ...doc }));
		const findOneAndUpdate = jest.fn((_filter: object, update: object) => ({ exec: async () => ({ ...storedOrder, ...update }) }));
		const orderModel = {
			create,
			findOne: jest.fn(() => ({ lean: () => ({ exec: async () => storedOrder }) })),
			findOneAndUpdate,
		} as unknown as Model<Order>;
		const propertyModel = {
			find: jest.fn(() => ({ select: () => ({ lean: () => ({ exec: async () => properties }) }) })),
		} as unknown as Model<unknown>;
		const notify = { notifyCustomer: jest.fn(), notifyAdminNewOrder: jest.fn() };
		const tossConfirm = jest.fn(async () => ({ status: 'DONE' }));
		const redeemCoupon = jest.fn(async (couponCode: string) => ({ couponCode, discountAmount }));
		const service = new OrderService(
			orderModel,
			propertyModel,
			notify as unknown as TelegramNotifyService,
			notify as unknown as MailNotifyService,
			{ redeemCoupon } as unknown as CouponService,
			{ confirm: tossConfirm } as unknown as TossPaymentService,
			{ sendToMember: jest.fn(async () => undefined) } as unknown as PushService,
		);
		// auto-progression taymerlari testda ishga tushmasin
		jest.spyOn(service as unknown as { scheduleAutoProgression: () => void }, 'scheduleAutoProgression').mockImplementation(() => undefined);
		return { service, create, redeemCoupon, notify, tossConfirm, findOneAndUpdate };
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

	describe('Toss', () => {
		const KRW_PER_USD = 1350;
		const unpaid = { _id: 'o1', orderId: 'ZIN-1', memberId: MEMBER_ID, orderTotal: 100, paymentMethod: PaymentMethod.TOSS, paymentStatus: PaymentStatus.UNPAID, paymentAmount: 100 * KRW_PER_USD };
		const confirmInput = { paymentKey: 'pk_1', orderId: 'ZIN-1', amount: 100 * KRW_PER_USD };

		it('Toss buyurtma UNPAID va KRW summasi bilan yaratiladi, xabar yuborilmaydi', async () => {
			const { service, notify } = makeService([sofa, chair]);
			const order = await service.createOrder(MEMBER_ID, makeInput({ paymentMethod: PaymentMethod.TOSS }));
			expect(order).toMatchObject({ paymentStatus: PaymentStatus.UNPAID, paymentCurrency: 'KRW', paymentAmount: 1080000 * KRW_PER_USD });
			expect(notify.notifyCustomer).not.toHaveBeenCalled();
		});

		it('summa buyurtmadagidan farq qilsa Toss\'ga so\'rov yuborilmaydi', async () => {
			const { service, tossConfirm } = makeService([], 0, unpaid);
			await expect(service.confirmTossPayment(MEMBER_ID, { ...confirmInput, amount: 100 })).rejects.toBeInstanceOf(BadRequestException);
			expect(tossConfirm).not.toHaveBeenCalled();
		});

		it('to\'g\'ri summa — Toss tasdiqlaydi, buyurtma PAID bo\'ladi', async () => {
			const { service, tossConfirm, findOneAndUpdate, notify } = makeService([], 0, unpaid);
			const order = await service.confirmTossPayment(MEMBER_ID, confirmInput);
			expect(tossConfirm).toHaveBeenCalledWith('pk_1', 'ZIN-1', 100 * KRW_PER_USD);
			expect(findOneAndUpdate.mock.calls[0][0]).toMatchObject({ paymentStatus: PaymentStatus.UNPAID });
			expect(order.paymentStatus).toBe(PaymentStatus.PAID);
			expect(notify.notifyAdminNewOrder).toHaveBeenCalled();
		});

		it('allaqachon to\'langan buyurtma qayta tasdiqlanmaydi', async () => {
			const paid = { ...unpaid, paymentStatus: PaymentStatus.PAID, paymentKey: 'pk_1' };
			const { service, tossConfirm } = makeService([], 0, paid);
			const order = await service.confirmTossPayment(MEMBER_ID, confirmInput);
			expect(order.paymentStatus).toBe(PaymentStatus.PAID);
			expect(tossConfirm).not.toHaveBeenCalled();
		});

		it('boshqa odamning buyurtmasi topilmaydi', async () => {
			const { service } = makeService([], 0, null);
			await expect(service.confirmTossPayment(MEMBER_ID, confirmInput)).rejects.toBeInstanceOf(BadRequestException);
		});
	});

	describe('expireUnpaidOnlineOrders', () => {
		const stale = { _id: 'o9', orderId: 'ZIN-9', paymentMethod: PaymentMethod.TOSS, memberId: MEMBER_ID, orderTotal: 10, paymentAmount: 13500, orderCouponCode: 'SALE10' };

		const makeExpiry = (tossResult: object | null) => {
			const findOneAndUpdate = jest.fn((_filter: object, update: object) => ({ exec: async () => ({ ...stale, ...update }) }));
			const orderModel = {
				find: jest.fn(() => ({ limit: () => ({ lean: () => ({ exec: async () => [stale] }) }) })),
				findOneAndUpdate,
			} as unknown as Model<Order>;
			const notify = { notifyCustomer: jest.fn(), notifyAdminNewOrder: jest.fn() };
			const releaseCoupon = jest.fn(async () => undefined);
			const service = new OrderService(
				orderModel,
				{} as Model<unknown>,
				notify as unknown as TelegramNotifyService,
				notify as unknown as MailNotifyService,
				{ releaseCoupon } as unknown as CouponService,
				{ findByOrderId: jest.fn(async () => tossResult) } as unknown as TossPaymentService,
				{ sendToMember: jest.fn(async () => undefined) } as unknown as PushService,
			);
			jest.spyOn(service as unknown as { scheduleAutoProgression: () => void }, 'scheduleAutoProgression').mockImplementation(() => undefined);
			return { service, findOneAndUpdate, releaseCoupon, notify };
		};

		it("Toss'da to'lov yo'q — bekor qilinadi va kupon qaytariladi", async () => {
			const { service, findOneAndUpdate, releaseCoupon, notify } = makeExpiry(null);
			await service.expireUnpaidOnlineOrders();
			expect(findOneAndUpdate.mock.calls[0][1]).toMatchObject({ orderStatus: OrderStatus.CANCELLED });
			expect(releaseCoupon).toHaveBeenCalledWith('SALE10');
			expect(notify.notifyAdminNewOrder).not.toHaveBeenCalled();
		});

		it("Toss'da DONE — PAID qilinadi, bekor qilinmaydi", async () => {
			const { service, findOneAndUpdate, releaseCoupon, notify } = makeExpiry({ status: 'DONE', totalAmount: 13500, paymentKey: 'pk_9' });
			await service.expireUnpaidOnlineOrders();
			expect(findOneAndUpdate.mock.calls[0][1]).toMatchObject({ paymentStatus: PaymentStatus.PAID, paymentKey: 'pk_9' });
			expect(releaseCoupon).not.toHaveBeenCalled();
			expect(notify.notifyAdminNewOrder).toHaveBeenCalled();
		});

		it("Toss summasi mos kelmasa — PAID qilinmaydi", async () => {
			const { service, findOneAndUpdate } = makeExpiry({ status: 'DONE', totalAmount: 1, paymentKey: 'pk_9' });
			await service.expireUnpaidOnlineOrders();
			expect(findOneAndUpdate.mock.calls[0][1]).toMatchObject({ orderStatus: OrderStatus.CANCELLED });
		});
	});

	describe('advanceDemoOrders (demo status progression)', () => {
		const makeProgress = (due: object[], updated: object | null = { memberId: 'm1', orderId: 'ZIN-1' }) => {
			const findOneAndUpdate = jest.fn((_filter: object, _update: object) => ({ exec: async () => updated }));
			const updateOne = jest.fn((_filter: object, _update: object) => ({ exec: async () => undefined }));
			const orderModel = {
				find: jest.fn(() => ({ select: () => ({ limit: () => ({ lean: () => ({ exec: async () => due }) }) }) })),
				findOneAndUpdate,
				updateOne,
			} as unknown as Model<Order>;
			const notify = { notifyCustomer: jest.fn(), notifyAdminNewOrder: jest.fn() };
			const service = new OrderService(
				orderModel,
				{} as Model<unknown>,
				notify as unknown as TelegramNotifyService,
				notify as unknown as MailNotifyService,
				{} as CouponService,
				{} as TossPaymentService,
				{ sendToMember: jest.fn(async () => undefined) } as unknown as PushService,
			);
			return { service, findOneAndUpdate, updateOne, notify };
		};

		it('PENDING → PROCESSING, keyingi qadam vaqti belgilanadi', async () => {
			const { service, findOneAndUpdate, notify } = makeProgress([{ _id: 'o1', orderStatus: OrderStatus.PENDING }]);
			await service.advanceDemoOrders();
			const [filter, update] = findOneAndUpdate.mock.calls[0] as unknown as [object, { orderStatus: OrderStatus; orderAutoProgressAt: Date }];
			expect(filter).toEqual({ _id: 'o1', orderStatus: OrderStatus.PENDING });
			expect(update.orderStatus).toBe(OrderStatus.PROCESSING);
			expect(update.orderAutoProgressAt.getTime()).toBeGreaterThan(Date.now());
			expect(notify.notifyCustomer).toHaveBeenCalledWith('m1', 'ZIN-1', OrderStatus.PROCESSING);
		});

		it('SHIPPED → DELIVERED, kuzatuv tugaydi', async () => {
			const { service, findOneAndUpdate } = makeProgress([{ _id: 'o1', orderStatus: OrderStatus.SHIPPED }]);
			await service.advanceDemoOrders();
			expect(findOneAndUpdate.mock.calls[0][1]).toEqual({ orderStatus: OrderStatus.DELIVERED, $unset: { orderAutoProgressAt: 1 } });
		});

		it("qo'lda CANCELLED qilingan buyurtma surilmaydi, faqat kuzatuvdan chiqariladi", async () => {
			const { service, findOneAndUpdate, updateOne } = makeProgress([{ _id: 'o1', orderStatus: OrderStatus.CANCELLED }]);
			await service.advanceDemoOrders();
			expect(findOneAndUpdate).not.toHaveBeenCalled();
			expect(updateOne).toHaveBeenCalledWith({ _id: 'o1' }, { $unset: { orderAutoProgressAt: 1 } });
		});

		it("status parallel o'zgargan bo'lsa (atomik filter mos kelmadi) xabar yuborilmaydi", async () => {
			const { service, notify } = makeProgress([{ _id: 'o1', orderStatus: OrderStatus.PENDING }], null);
			await service.advanceDemoOrders();
			expect(notify.notifyCustomer).not.toHaveBeenCalled();
		});
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
