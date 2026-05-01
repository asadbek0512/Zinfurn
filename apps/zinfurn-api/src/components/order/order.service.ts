import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Order, Orders } from '../../libs/dto/order/order';
import { CreateOrderInput, OrdersInquiry } from '../../libs/dto/order/order.input';
import { OrderUpdate } from '../../libs/dto/order/order.update';
import { OrderStatus } from '../../libs/enums/order.enum';
import { Message, Direction } from '../../libs/enums/common_enum';
import { T } from '../../libs/types/common';
import { lookupMember } from '../../libs/config';

@Injectable()
export class OrderService {
	constructor(
		@InjectModel('Order') private readonly orderModel: Model<Order>,
	) {}

	public async createOrder(memberId: ObjectId, input: CreateOrderInput): Promise<Order> {
		input.memberId = memberId;
		const orderId = `ZIN-${Date.now()}`;
		try {
			return await this.orderModel.create({ ...input, orderId });
		} catch (err) {
			console.log('OrderService.createOrder error:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
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
		return this.orderModel.findByIdAndUpdate(
			orderId,
			{ orderStatus: OrderStatus.CONFIRMED, confirmedAt: new Date() },
			{ new: true },
		) as unknown as Order;
	}

	public async requestReturn(memberId: ObjectId, input: OrderUpdate): Promise<Order> {
		const order = await this.orderModel.findOne({ _id: input._id, memberId });
		if (!order) throw new BadRequestException(Message.NO_DATA_FOUND);
		if (order.orderStatus !== OrderStatus.CONFIRMED) {
			throw new BadRequestException('Order must be CONFIRMED before return request');
		}
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
		return this.orderModel.findByIdAndUpdate(input._id, updateData, { new: true }) as unknown as Order;
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
