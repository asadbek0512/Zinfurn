import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { OrderStatus } from '../../enums/order.enum';
import { Member, TotalCounter } from '../member/member';

@ObjectType()
export class OrderItem {
	@Field(() => String)
	propertyId: ObjectId;

	@Field(() => String)
	propertyTitle: string;

	@Field(() => String, { nullable: true })
	propertyImage?: string;

	@Field(() => Float)
	propertyPrice: number;

	@Field(() => Int)
	quantity: number;
}

@ObjectType()
export class DeliveryInfo {
	@Field(() => String)
	fullName: string;

	@Field(() => String)
	address: string;

	@Field(() => String)
	city: string;

	@Field(() => String)
	phone: string;

	@Field(() => String, { nullable: true })
	note?: string;
}

@ObjectType()
export class Order {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => String)
	orderId: string;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => [OrderItem])
	orderItems: OrderItem[];

	@Field(() => OrderStatus)
	orderStatus: OrderStatus;

	@Field(() => Float)
	orderTotal: number;

	@Field(() => DeliveryInfo)
	deliveryInfo: DeliveryInfo;

	@Field(() => Date, { nullable: true })
	confirmedAt?: Date;

	@Field(() => Date, { nullable: true })
	cancelledAt?: Date;

	@Field(() => Date, { nullable: true })
	returnRequestedAt?: Date;

	@Field(() => String, { nullable: true })
	returnReason?: string;

	@Field(() => Date, { nullable: true })
	returnedAt?: Date;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	/** from aggregation **/
	@Field(() => Member, { nullable: true })
	memberData?: Member;
}

@ObjectType()
export class Orders {
	@Field(() => [Order])
	list: Order[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
