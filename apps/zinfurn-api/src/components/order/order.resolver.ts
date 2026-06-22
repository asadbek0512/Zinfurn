import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { ShapeIntoMongoObjectId } from '../../libs/config';
import { MemberType } from '../../libs/enums/member.enum';
import { Order, Orders } from '../../libs/dto/order/order';
import { CreateOrderInput, OrdersInquiry } from '../../libs/dto/order/order.input';
import { OrderUpdate } from '../../libs/dto/order/order.update';
import { OrderService } from './order.service';

@Resolver()
export class OrderResolver {
	constructor(private readonly orderService: OrderService) {}

	@UseGuards(AuthGuard)
	@Mutation(() => Order)
	public async createOrder(
		@Args('input') input: CreateOrderInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Order> {
		return this.orderService.createOrder(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Query(() => Orders)
	public async getMyOrders(
		@Args('input') input: OrdersInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Orders> {
		return this.orderService.getMyOrders(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Query(() => Order)
	public async getOrderById(
		@Args('orderId') orderId: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Order> {
		return this.orderService.getOrderById(memberId, ShapeIntoMongoObjectId(orderId));
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Order)
	public async confirmDelivery(
		@Args('orderId') orderId: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Order> {
		return this.orderService.confirmDelivery(memberId, ShapeIntoMongoObjectId(orderId));
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Order)
	public async demoDeliverOrder(
		@Args('orderId') orderId: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Order> {
		return this.orderService.demoDeliverOrder(memberId, ShapeIntoMongoObjectId(orderId));
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Order)
	public async requestReturn(
		@Args('input') input: OrderUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Order> {
		input._id = ShapeIntoMongoObjectId(input._id);
		return this.orderService.requestReturn(memberId, input);
	}

	/** ADMIN **/

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Order)
	public async updateOrderStatusByAdmin(@Args('input') input: OrderUpdate): Promise<Order> {
		input._id = ShapeIntoMongoObjectId(input._id);
		return this.orderService.updateOrderStatusByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => Orders)
	public async getAllOrdersByAdmin(@Args('input') input: OrdersInquiry): Promise<Orders> {
		return this.orderService.getAllOrdersByAdmin(input);
	}
}
