import { Schema } from 'mongoose';
import { OrderStatus } from '../libs/enums/order.enum';

const OrderItemSchema = new Schema(
	{
		propertyId: { type: Schema.Types.ObjectId, required: true, ref: 'Property' },
		propertyTitle: { type: String, required: true },
		propertyImage: { type: String },
		propertyPrice: { type: Number, required: true },
		quantity: { type: Number, required: true, default: 1 },
	},
	{ _id: false },
);

const DeliveryInfoSchema = new Schema(
	{
		fullName: { type: String, required: true },
		address: { type: String, required: true },
		city: { type: String, required: true },
		phone: { type: String, required: true },
		note: { type: String },
	},
	{ _id: false },
);

const OrderSchema = new Schema(
	{
		orderId: { type: String, required: true, unique: true },
		memberId: { type: Schema.Types.ObjectId, required: true, ref: 'Member' },
		orderItems: { type: [OrderItemSchema], required: true },
		orderStatus: { type: String, enum: OrderStatus, default: OrderStatus.PENDING },
		orderTotal: { type: Number, required: true },
		orderCouponCode: { type: String },
		orderDiscount: { type: Number, default: 0 },
		deliveryInfo: { type: DeliveryInfoSchema, required: true },
		confirmedAt: { type: Date },
		cancelledAt: { type: Date },
		returnRequestedAt: { type: Date },
		returnReason: { type: String },
		returnedAt: { type: Date },
	},
	{ timestamps: true, collection: 'orders' },
);

export default OrderSchema;
