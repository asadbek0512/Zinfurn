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

@Injectable()
export class OrderService {
	constructor(
		@InjectModel('Order') private readonly orderModel: Model<Order>,
		@InjectModel('Property') private readonly propertyModel: Model<any>,
		private readonly telegramNotify: TelegramNotifyService,
		private readonly mailNotify: MailNotifyService,
		private readonly couponService: CouponService,
	) {}

	public async createOrder(memberId: ObjectId, input: CreateOrderInput): Promise<Order> {
		input.memberId = memberId;
		const orderId = `ZIN-${Date.now()}`;

		// Kupon: server o'zi tekshiradi va chegirmani o'zi hisoblaydi (clientga ishonmaymiz)
		let orderDiscount = 0;
		let orderCouponCode: string | undefined;
		if (input.couponCode) {
			const redeemed = await this.couponService.redeemCoupon(input.couponCode, input.orderTotal);
			orderDiscount = redeemed.discountAmount;
			orderCouponCode = redeemed.couponCode;
			input.orderTotal = Math.max(0, input.orderTotal - orderDiscount);
		}

		try {
			const order = await this.orderModel.create({ ...input, orderId, orderDiscount, orderCouponCode });
			this.scheduleAutoProgression(order._id as ObjectId);
			// Telegram xabarlar (non-blocking)
			this.telegramNotify.notifyCustomer(memberId, orderId, OrderStatus.PENDING, order.orderTotal);
			this.mailNotify.notifyCustomer(memberId, orderId, OrderStatus.PENDING, order.orderTotal);
			this.telegramNotify.notifyAdminNewOrder(orderId, order.orderTotal, order.orderItems?.length ?? 0);
			return order;
		} catch (err) {
			Logger.error('OrderService.createOrder error:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	// Demo: auto-progress order status for portfolio showcase
	private scheduleAutoProgression(orderId: ObjectId): void {
		// Faqat kutilgan oldingi statusdan o'tkazadi — manual status (masalan erta
		// DELIVERED/CONFIRMED yoki CANCELLED) taymer tomonidan ORQAGA qaytarilmaydi.
		const advance = (from: OrderStatus, to: OrderStatus, delayMs: number) => {
			setTimeout(async () => {
				try {
					const doc = await this.orderModel.findOneAndUpdate(
						{ _id: orderId, orderStatus: from },
						{ orderStatus: to },
						{ new: true },
					);
					if (doc) {
						this.telegramNotify.notifyCustomer(doc.memberId, doc.orderId, to);
						this.mailNotify.notifyCustomer(doc.memberId, doc.orderId, to);
					}
				} catch {}
			}, delayMs);
		};

		advance(OrderStatus.PENDING,    OrderStatus.PROCESSING, 15_000);   // 15s
		advance(OrderStatus.PROCESSING, OrderStatus.SHIPPED,    35_000);   // 35s
		advance(OrderStatus.SHIPPED,    OrderStatus.DELIVERED,  60_000);   // 60s
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

	/** ADMIN **/

	public async updateOrderStatusByAdmin(input: OrderUpdate): Promise<Order> {
		const updateData: T = { orderStatus: input.orderStatus };
		if (input.orderStatus === OrderStatus.RETURNED) updateData.returnedAt = new Date();
		const updated = (await this.orderModel.findByIdAndUpdate(input._id, updateData, { new: true })) as unknown as Order;
		if (updated && input.orderStatus) {
			this.telegramNotify.notifyCustomer(updated.memberId, updated.orderId, input.orderStatus);
			this.mailNotify.notifyCustomer(updated.memberId, updated.orderId, input.orderStatus);
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
