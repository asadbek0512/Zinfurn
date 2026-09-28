import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { ArrayMaxSize, ArrayNotEmpty, IsEnum, IsIn, IsInt, IsString, Length, IsNotEmpty, IsOptional, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../../enums/payment.enum';

/** Bitta pozitsiya uchun maksimal miqdor va bitta buyurtmadagi maksimal pozitsiyalar */
export const MAX_ITEM_QUANTITY = 99;
export const MAX_ORDER_ITEMS = 50;
/** Toss hujjatidagi maksimal uzunliklar */
const TOSS_PAYMENT_KEY_MAX = 200;
const TOSS_ORDER_ID_MAX = 64;
import { ObjectId } from 'mongoose';
import { OrderStatus } from '../../enums/order.enum';
import { Direction } from '../../enums/common_enum';

@InputType()
export class OrderItemInput {
	@IsNotEmpty()
	@Field(() => String)
	propertyId: ObjectId;

	@IsNotEmpty()
	@Field(() => String)
	propertyTitle: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	propertyImage?: string;

	@IsNotEmpty()
	@Field(() => Float)
	propertyPrice: number;

	@IsInt()
	@Min(1)
	@Max(MAX_ITEM_QUANTITY)
	@Field(() => Int)
	quantity: number;
}

@InputType()
export class DeliveryInfoInput {
	@IsNotEmpty()
	@Field(() => String)
	fullName: string;

	@IsNotEmpty()
	@Field(() => String)
	address: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	city?: string;

	@IsNotEmpty()
	@Field(() => String)
	phone: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	note?: string;
}

@InputType()
export class CreateOrderInput {
	@ArrayNotEmpty()
	@ArrayMaxSize(MAX_ORDER_ITEMS)
	@ValidateNested({ each: true })
	@Type(() => OrderItemInput)
	@Field(() => [OrderItemInput])
	orderItems: OrderItemInput[];

	@IsNotEmpty()
	@Field(() => Float)
	orderTotal: number;

	@IsOptional()
	@Field(() => String, { nullable: true })
	couponCode?: string;

	@IsNotEmpty()
	@Field(() => DeliveryInfoInput)
	deliveryInfo: DeliveryInfoInput;

	@IsOptional()
	@IsEnum(PaymentMethod)
	@Field(() => PaymentMethod, { nullable: true })
	paymentMethod?: PaymentMethod;

	memberId?: ObjectId;
}

@InputType()
export class ConfirmTossPaymentInput {
	@IsString()
	@Length(1, TOSS_PAYMENT_KEY_MAX)
	@Field(() => String)
	paymentKey: string;

	@IsString()
	@Length(1, TOSS_ORDER_ID_MAX)
	@Field(() => String)
	orderId: string;

	@IsInt()
	@Min(1)
	@Field(() => Int)
	amount: number;
}

@InputType()
class OISearch {
	@IsOptional()
	@Field(() => OrderStatus, { nullable: true })
	orderStatus?: OrderStatus;
}

@InputType()
export class OrdersInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(['createdAt', 'updatedAt'])
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsOptional()
	@Field(() => OISearch, { nullable: true })
	search?: OISearch;
}
