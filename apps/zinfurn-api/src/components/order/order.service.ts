import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Order, Orders } from '../../libs/dto/order/order';
import { CreateOrderInput, OrdersInquiry } from '../../libs/dto/order/order.input';
import { OrderUpdate } from '../../libs/dto/order/order.update';
import { OrderStatus } from '../../libs/enums/order.enum';
import { Message, Direction } from '../../libs/enums/common_enum';
import { T } from '../../libs/types/common';
import { lookupMember } from '../../libs/config';
import { TelegramNotifyService } from './telegram-notify.service';
import { MailNotifyService } from './mail-notify.service';
import { CouponService } from '../coupon/coupon.service';
import { ConfirmTossPaymentInput, OrderItemInput } from '../../libs/dto/order/order.input';
import { PaymentMethod, PaymentStatus } from '../../libs/enums/payment.enum';
import { TOSS_DONE_STATUS, TossPaymentService } from './toss-payment.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PropertyStatus } from '../../libs/enums/property.enum';
import { PriceSource, effectivePrice } from '../../libs/pricing';
import { PushService } from '../push/push.service';

/** Narxlar USD'da saqlanadi; Toss faqat KRW qabul qiladi */
const TOSS_CURRENCY = 'KRW';
const DEFAULT_KRW_PER_USD = 1350;
/** Shu vaqtdan keyin to'lanmagan Toss buyurtmasi bekor qilinadi */
const TOSS_UNPAID_TTL_MS = 30 * 60 * 1000;
/** Bitta cron ishga tushishida ko'rib chiqiladigan buyurtmalar soni */
const TOSS_EXPIRE_BATCH = 100;
/** Demo status progression: har status keyingisiga shuncha vaqtdan keyin o'tadi */
const DEMO_PROGRESSION: Partial<Record<OrderStatus, { next: OrderStatus; afterMs: number }>> = {
	[OrderStatus.PENDING]: { next: OrderStatus.PROCESSING, afterMs: 15_000 },
	[OrderStatus.PROCESSING]: { next: OrderStatus.SHIPPED, afterMs: 20_000 },
	[OrderStatus.SHIPPED]: { next: OrderStatus.DELIVERED, afterMs: 25_000 },
};
/** Bitta cron ishga tushishida suriladigan demo buyurtmalar soni */
const DEMO_PROGRESS_BATCH = 50;
const ORDERS_URL = '/mypage?category=myOrders';
const ORDER_STATUS_PUSH: Partial<Record<OrderStatus, string>> = {
	[OrderStatus.PENDING]: 'Buyurtmangiz qabul qilindi',
	[OrderStatus.PROCESSING]: 'Buyurtmangiz tayyorlanmoqda',
	[OrderStatus.SHIPPED]: "Buyurtmangiz yo'lga chiqdi 🚚",
	[OrderStatus.DELIVERED]: 'Buyurtmangiz yetkazildi ✅',
	[OrderStatus.CANCELLED]: 'Buyurtma bekor qilindi',
	[OrderStatus.RETURNED]: 'Qaytarish qabul qilindi',
};
const krwPerUsd = (): number => Number(process.env.KRW_PER_USD) || DEFAULT_KRW_PER_USD;

type OrderableProperty = PriceSource & { _id: ObjectId; propertyTitle: string; propertyImages?: string[] };

@Injectable()
export class OrderService {
	private readonly logger = new Logger(OrderService.name);

	constructor(
		@InjectModel('Order') private readonly orderModel: Model<Order>,
		@InjectModel('Property') private readonly propertyModel: Model<any>,
		private readonly telegramNotify: TelegramNotifyService,
		private readonly mailNotify: MailNotifyService,
		private readonly couponService: CouponService,
		private readonly tossPayment: TossPaymentService,
		private readonly pushService: PushService,
	) {}

	public async createOrder(memberId: ObjectId, input: CreateOrderInput): Promise<Order> {
		input.memberId = memberId;
		const orderId = `ZIN-${Date.now()}`;

		// Narx va summa FAQAT serverda hisoblanadi — client yuborgan price/total'ga ishonmaymiz
		input.orderItems = await this.priceOrderItems(input.orderItems);
		input.orderTotal = input.orderItems.reduce((sum, item) => sum + item.propertyPrice * item.quantity, 0);

		// Kupon: server o'zi tekshiradi va chegirmani o'zi hisoblaydi (clientga ishonmaymiz)
		let orderDiscount = 0;
		let orderCouponCode: string | undefined;
		if (input.couponCode) {
			const redeemed = await this.couponService.redeemCoupon(input.couponCode, input.orderTotal);
			orderDiscount = redeemed.discountAmount;
			orderCouponCode = redeemed.couponCode;
			input.orderTotal = Math.max(0, input.orderTotal - orderDiscount);
		}

		// Toss: buyurtma to'lanmagan holda yaratiladi, to'lov confirmTossPayment'da tasdiqlanadi
		const paymentMethod = input.paymentMethod ?? PaymentMethod.CARD;
		const isToss = paymentMethod === PaymentMethod.TOSS;
		const payment = {
			paymentMethod,
			paymentStatus: isToss ? PaymentStatus.UNPAID : PaymentStatus.PAID,
			paymentCurrency: isToss ? TOSS_CURRENCY : undefined,
			paymentAmount: isToss ? Math.round(input.orderTotal * krwPerUsd()) : undefined,
		};

		try {
			const order = await this.orderModel.create({ ...input, orderId, orderDiscount, orderCouponCode, ...payment });
			if (!isToss) this.onOrderPaid(order);
			return order;
		} catch (err) {
			Logger.error('OrderService.createOrder error:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	/**
	 * Toss successUrl'dan kelgan to'lovni tasdiqlaydi. Summa DB'dagi buyurtma bilan solishtiriladi —
	 * client URL'dagi amount'ni o'zgartirsa ham Toss'ga so'rov yuborilmaydi.
	 */
	public async confirmTossPayment(memberId: ObjectId, input: ConfirmTossPaymentInput): Promise<Order> {
		const { paymentKey, orderId, amount } = input;
		const order = await this.orderModel
			.findOne({ orderId, memberId, paymentMethod: PaymentMethod.TOSS })
			.lean<Order & { paymentKey?: string }>()
			.exec();
		if (!order) throw new BadRequestException(Message.NO_DATA_FOUND);
		// Sahifa yangilansa qayta tasdiqlash so'ralmaydi
		if (order.paymentStatus === PaymentStatus.PAID) {
			if (order.paymentKey !== paymentKey) throw new BadRequestException(Message.PAYMENT_FAILED);
			return order;
		}
		if (order.paymentAmount !== amount) throw new BadRequestException(Message.PAYMENT_AMOUNT_MISMATCH);

		await this.tossPayment.confirm(paymentKey, orderId, amount);

		const paid = await this.markTossPaid(order._id as ObjectId, paymentKey);
		// Parallel so'rov allaqachon PAID qilgan bo'lsa — o'sha holatni qaytaramiz
		if (!paid) {
			const current = await this.orderModel.findById(order._id).exec();
			if (!current) throw new BadRequestException(Message.NO_DATA_FOUND);
			return current;
		}
		return paid;
	}

	/**
	 * Eski UNPAID Toss buyurtmalari: avval Toss'dan holatini so'raymiz (tab yopilib confirm
	 * chaqirilmagan bo'lsa ham pul yechilgan bo'lishi mumkin), aks holda bekor qilib kuponni qaytaramiz.
	 */
	@Cron(CronExpression.EVERY_5_MINUTES)
	public async expireUnpaidTossOrders(): Promise<void> {
		const cutoff = new Date(Date.now() - TOSS_UNPAID_TTL_MS);
		const stale = await this.orderModel
			.find({
				paymentMethod: PaymentMethod.TOSS,
				paymentStatus: PaymentStatus.UNPAID,
				orderStatus: { $ne: OrderStatus.CANCELLED },
				createdAt: { $lt: cutoff },
			})
			.limit(TOSS_EXPIRE_BATCH)
			.lean<Order[]>()
			.exec();

		for (const order of stale) {
			const toss = await this.tossPayment.findByOrderId(order.orderId);
			if (toss?.status === TOSS_DONE_STATUS && toss.totalAmount === order.paymentAmount) {
				await this.markTossPaid(order._id as ObjectId, toss.paymentKey);
				this.logger.log(`Toss order reconciled as paid: ${order.orderId}`);
				continue;
			}
			const cancelled = await this.orderModel
				.findOneAndUpdate(
					{ _id: order._id, paymentStatus: PaymentStatus.UNPAID, orderStatus: { $ne: OrderStatus.CANCELLED } },
					{ orderStatus: OrderStatus.CANCELLED },
				)
				.exec();
			if (cancelled?.orderCouponCode) await this.couponService.releaseCoupon(cancelled.orderCouponCode);
		}
	}

	/** UNPAID → PAID atomar o'tkazish; faqat birinchi muvaffaqiyatli chaqiruv onOrderPaid'ni ishga tushiradi */
	private async markTossPaid(id: ObjectId, paymentKey: string): Promise<Order | null> {
		const paid = await this.orderModel
			.findOneAndUpdate(
				{ _id: id, paymentStatus: PaymentStatus.UNPAID },
				{ paymentStatus: PaymentStatus.PAID, paymentKey, paidAt: new Date() },
				{ new: true },
			)
			.exec();
		if (paid) this.onOrderPaid(paid);
		return paid;
	}

	/** To'lov tasdiqlangach: xabarlar va demo status progression */
	private onOrderPaid(order: Order): void {
		const { memberId, orderId, orderTotal } = order;
		this.scheduleAutoProgression(order._id as ObjectId);
		// Telegram/email xabarlar (non-blocking)
		this.telegramNotify.notifyCustomer(memberId, orderId, OrderStatus.PENDING, orderTotal);
		this.mailNotify.notifyCustomer(memberId, orderId, OrderStatus.PENDING, orderTotal);
		this.notifyPush(memberId, orderId, OrderStatus.PENDING);
		this.telegramNotify.notifyAdminNewOrder(orderId, orderTotal, order.orderItems?.length ?? 0);
	}

	/** Har pozitsiyani DB'dagi mahsulot bo'yicha qayta narxlaydi; sotuvda bo'lmasa rad etadi */
	private async priceOrderItems(items: OrderItemInput[]): Promise<OrderItemInput[]> {
		const ids = items.map((item) => item.propertyId);
		const properties = await this.propertyModel
			.find({ _id: { $in: ids }, propertyStatus: PropertyStatus.ACTIVE })
			.select('propertyTitle propertyImages propertyPrice propertySalePrice propertyIsOnSale propertySaleStartsAt propertySaleExpiresAt')
			.lean<OrderableProperty[]>()
			.exec();
		const byId = new Map(properties.map((property) => [String(property._id), property]));

		return items.map((item) => {
			const property = byId.get(String(item.propertyId));
			if (!property) throw new BadRequestException(Message.PRODUCT_NOT_AVAILABLE);
			return {
				propertyId: item.propertyId,
				propertyTitle: property.propertyTitle,
				propertyImage: property.propertyImages?.[0] ?? item.propertyImage,
				propertyPrice: effectivePrice(property),
				quantity: item.quantity,
			};
		});
	}

	/** Demo progression'ni boshlaydi — taymer emas, DB'dagi vaqt; cron uni suradi */
	private scheduleAutoProgression(orderId: ObjectId): void {
		const firstStep = DEMO_PROGRESSION[OrderStatus.PENDING]!;
		this.orderModel
			.updateOne({ _id: orderId }, { orderAutoProgressAt: new Date(Date.now() + firstStep.afterMs) })
			.exec()
			.catch((err: Error) => this.logger.warn(`Demo progression not scheduled: ${err.message}`));
	}

	/**
	 * Vaqti kelgan demo buyurtmalarni keyingi statusga o'tkazadi. Faqat kutilgan statusdan
	 * o'tkazadi — manual status (CANCELLED, erta DELIVERED) orqaga qaytarilmaydi.
	 */
	@Cron(CronExpression.EVERY_10_SECONDS)
	public async advanceDemoOrders(): Promise<void> {
		const due = await this.orderModel
			.find({ orderAutoProgressAt: { $lte: new Date() } })
			.select('_id orderStatus')
			.limit(DEMO_PROGRESS_BATCH)
			.lean<{ _id: ObjectId; orderStatus: OrderStatus }[]>()
			.exec();

		for (const { _id, orderStatus } of due) {
			const step = DEMO_PROGRESSION[orderStatus];
			if (!step) {
				// Progression tugagan yoki status qo'lda o'zgargan — kuzatuvdan chiqariladi
				await this.orderModel.updateOne({ _id }, { $unset: { orderAutoProgressAt: 1 } }).exec();
				continue;
			}
			const following = DEMO_PROGRESSION[step.next];
			const update: T = following
				? { orderStatus: step.next, orderAutoProgressAt: new Date(Date.now() + following.afterMs) }
				: { orderStatus: step.next, $unset: { orderAutoProgressAt: 1 } };
			const doc = await this.orderModel
				.findOneAndUpdate({ _id, orderStatus }, update, { new: true })
				.exec();
			if (doc) {
				this.telegramNotify.notifyCustomer(doc.memberId, doc.orderId, step.next);
				this.mailNotify.notifyCustomer(doc.memberId, doc.orderId, step.next);
				this.notifyPush(doc.memberId, doc.orderId, step.next);
			}
		}
	}

	public async getMyOrders(memberId: ObjectId, input: OrdersInquiry): Promise<Orders> {
		const { page, limit, sort, direction, search } = input;
		const match: T = { memberId };
		if (search?.orderStatus) match.orderStatus = search.orderStatus;

		const sortBy: T = { [sort ?? 'createdAt']: direction ?? Direction.DESC };

		const result = await this.orderModel
			.aggregate([
				{ $match: match },
				{ $sort: sortBy },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							lookupMember,
							{ $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		return result[0] as Orders;
	}

	public async getOrderById(memberId: ObjectId, orderId: ObjectId): Promise<Order> {
		const result = await this.orderModel
			.aggregate([
				{ $match: { _id: orderId, memberId } },
				lookupMember,
				{ $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } },
			])
			.exec();

		if (!result[0]) throw new BadRequestException(Message.NO_DATA_FOUND);
		return result[0] as Order;
	}

	public async confirmDelivery(memberId: ObjectId, orderId: ObjectId): Promise<Order> {
		const order = await this.orderModel.findOne({ _id: orderId, memberId });
		if (!order) throw new BadRequestException(Message.NO_DATA_FOUND);
		if (order.orderStatus !== OrderStatus.DELIVERED) {
			throw new BadRequestException('Order must be DELIVERED before confirmation');
		}
		const confirmed = await this.orderModel.findByIdAndUpdate(
			orderId,
			{ orderStatus: OrderStatus.CONFIRMED, confirmedAt: new Date() },
			{ new: true },
		) as unknown as Order;

		this.telegramNotify.notifyCustomer(memberId, order.orderId, OrderStatus.CONFIRMED);
		this.mailNotify.notifyCustomer(memberId, order.orderId, OrderStatus.CONFIRMED);

		// increment sold count for each item
		for (const item of order.orderItems) {
			await this.propertyModel.findByIdAndUpdate(
				item.propertyId,
				{ $inc: { propertySoldCount: item.quantity } },
			);
		}
		return confirmed;
	}

	public async demoDeliverOrder(memberId: ObjectId, orderId: ObjectId): Promise<Order> {
		const order = await this.orderModel.findOne({ _id: orderId, memberId });
		if (!order) throw new BadRequestException(Message.NO_DATA_FOUND);
		const ACTIVE = ['PENDING', 'PROCESSING', 'SHIPPED'];
		if (!ACTIVE.includes(order.orderStatus)) {
			throw new BadRequestException('Order is not in an active delivery state');
		}
		this.telegramNotify.notifyCustomer(memberId, order.orderId, OrderStatus.DELIVERED);
		this.mailNotify.notifyCustomer(memberId, order.orderId, OrderStatus.DELIVERED);
		return this.orderModel.findByIdAndUpdate(
			orderId,
			{ orderStatus: OrderStatus.DELIVERED },
			{ new: true },
		) as unknown as Order;
	}

	public async requestReturn(memberId: ObjectId, input: OrderUpdate): Promise<Order> {
		const order = await this.orderModel.findOne({ _id: input._id, memberId });
		if (!order) throw new BadRequestException(Message.NO_DATA_FOUND);
		if (order.orderStatus !== OrderStatus.CONFIRMED) {
			throw new BadRequestException('Order must be CONFIRMED before return request');
		}
		this.telegramNotify.notifyCustomer(memberId, order.orderId, OrderStatus.RETURN_REQUESTED);
		this.mailNotify.notifyCustomer(memberId, order.orderId, OrderStatus.RETURN_REQUESTED);
		return this.orderModel.findByIdAndUpdate(
			input._id,
			{
				orderStatus: OrderStatus.RETURN_REQUESTED,
				returnRequestedAt: new Date(),
				returnReason: input.returnReason,
			},
			{ new: true },
		) as unknown as Order;
	}

	private notifyPush(memberId: ObjectId, orderCode: string, status: OrderStatus): void {
		this.pushService.sendToMember(memberId, {
			title: `Zinfurn — ${orderCode}`,
			body: ORDER_STATUS_PUSH[status] ?? status,
			url: ORDERS_URL,
		});
	}

	/** ADMIN **/

	public async updateOrderStatusByAdmin(input: OrderUpdate): Promise<Order> {
		const updateData: T = { orderStatus: input.orderStatus };
		if (input.orderStatus === OrderStatus.RETURNED) updateData.returnedAt = new Date();
		const updated = (await this.orderModel.findByIdAndUpdate(input._id, updateData, { new: true })) as unknown as Order;
		if (updated && input.orderStatus) {
			this.telegramNotify.notifyCustomer(updated.memberId, updated.orderId, input.orderStatus);
			this.mailNotify.notifyCustomer(updated.memberId, updated.orderId, input.orderStatus);
			this.notifyPush(updated.memberId, updated.orderId, input.orderStatus);
		}
		return updated;
	}

	public async getAllOrdersByAdmin(input: OrdersInquiry): Promise<Orders> {
		const { page, limit, sort, direction, search } = input;
		const match: T = {};
		if (search?.orderStatus) match.orderStatus = search.orderStatus;

		const sortBy: T = { [sort ?? 'createdAt']: direction ?? Direction.DESC };

		const result = await this.orderModel
			.aggregate([
				{ $match: match },
				{ $sort: sortBy },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							lookupMember,
							{ $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		return result[0] as Orders;
	}
}
