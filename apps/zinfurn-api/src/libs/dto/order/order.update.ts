import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { ObjectId } from 'mongoose';
import { OrderStatus } from '../../enums/order.enum';

@InputType()
export class OrderUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Field(() => OrderStatus, { nullable: true })
	orderStatus?: OrderStatus;

	@IsOptional()
	@Field(() => String, { nullable: true })
	returnReason?: string;
}
