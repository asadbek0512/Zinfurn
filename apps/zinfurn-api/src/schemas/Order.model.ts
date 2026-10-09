import { Schema } from 'mongoose';
import { OrderStatus } from '../libs/enums/order.enum';
import { PaymentMethod, PaymentStatus } from '../libs/enums/payment.enum';

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
		city: { type: String },
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
		paymentMethod: { type: String, enum: PaymentMethod, default: PaymentMethod.CARD },
		paymentStatus: { type: String, enum: PaymentStatus, default: PaymentStatus.PAID },
		paymentAmount: { type: Number },
		paymentCurrency: { type: String },
		paymentKey: { type: String },
		paidAt: { type: Date },
		/** Payme tranzaksiyasi (Merchant API holatlari: 1 yaratilgan, 2 bajarilgan, -1/-2 bekor) */
		paymeTxn: {
			type: new Schema(
				{
					id: { type: String, required: true },
					time: { type: Number, required: true },
					createTime: { type: Number, required: true },
					performTime: { type: Number, default: 0 },
					cancelTime: { type: Number, default: 0 },
					state: { type: Number, required: true },
					reason: { type: Number, default: null },
				},
				{ _id: false },
			),
		},
		/** Click tranzaksiyasi: prepare'da yoziladi, complete'da tekshiriladi */
		clickTxn: {
			type: new Schema(
				{
					transId: { type: String, required: true },
					prepareId: { type: Number, required: true },
				},
				{ _id: false },
			),
		},
		confirmedAt: { type: Date },
		cancelledAt: { type: Date },
		returnRequestedAt: { type: Date },
		returnReason: { type: String },
		returnedAt: { type: Date },
		/** Demo: keyingi status qadami vaqti (cron o'qiydi, restart'da yo'qolmaydi) */
		orderAutoProgressAt: { type: Date, index: true },
	},
	{ timestamps: true, collection: 'orders' },
);

OrderSchema.index({ 'paymeTxn.id': 1 }, { sparse: true });
OrderSchema.index({ 'paymeTxn.createTime': 1 }, { sparse: true });

export default OrderSchema;
