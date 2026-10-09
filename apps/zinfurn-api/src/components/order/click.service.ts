import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { createHash, timingSafeEqual } from 'crypto';
import { Order } from '../../libs/dto/order/order';
import { OrderStatus } from '../../libs/enums/order.enum';
import { PaymentMethod, PaymentStatus } from '../../libs/enums/payment.enum';
import { OrderService } from './order.service';

/** Click Shop API — https://docs.click.uz/click-api-request */
enum ClickAction {
	PREPARE = 0,
	COMPLETE = 1,
}

enum ClickError {
	SUCCESS = 0,
	SIGN_FAILED = -1,
	INVALID_AMOUNT = -2,
	ACTION_NOT_FOUND = -3,
	ALREADY_PAID = -4,
	ORDER_NOT_FOUND = -5,
	TRANSACTION_NOT_FOUND = -6,
	BAD_REQUEST = -8,
	TRANSACTION_CANCELLED = -9,
}

const ERROR_NOTES: Record<ClickError, string> = {
	[ClickError.SUCCESS]: 'Success',
	[ClickError.SIGN_FAILED]: 'SIGN CHECK FAILED!',
	[ClickError.INVALID_AMOUNT]: 'Incorrect parameter amount',
	[ClickError.ACTION_NOT_FOUND]: 'Action not found',
	[ClickError.ALREADY_PAID]: 'Already paid',
	[ClickError.ORDER_NOT_FOUND]: 'Order does not exist',
	[ClickError.TRANSACTION_NOT_FOUND]: 'Transaction does not exist',
	[ClickError.BAD_REQUEST]: 'Error in request from click',
	[ClickError.TRANSACTION_CANCELLED]: 'Transaction cancelled',
};

/** Click summani "1000.00" ko'rinishida yuboradi — so'mgacha solishtiramiz */
const AMOUNT_EPSILON = 0.01;

export interface ClickRequest {
	click_trans_id?: string;
	service_id?: string;
	click_paydoc_id?: string;
	merchant_trans_id?: string;
	merchant_prepare_id?: string;
	amount?: string;
	action?: string;
	error?: string;
	error_note?: string;
	sign_time?: string;
	sign_string?: string;
}

export interface ClickResponse {
	click_trans_id: string | null;
	merchant_trans_id: string | null;
	merchant_prepare_id?: number;
	merchant_confirm_id?: number;
	error: ClickError;
	error_note: string;
}

type ClickOrder = Order & { clickTxn?: { transId: string; prepareId: number } };

@Injectable()
export class ClickService {
	private readonly logger = new Logger(ClickService.name);

	constructor(
		@InjectModel('Order') private readonly orderModel: Model<ClickOrder>,
		private readonly orderService: OrderService,
	) {}

	public async prepare(req: ClickRequest): Promise<ClickResponse> {
		const base = this.baseResponse(req);
		if (Number(req.action) !== ClickAction.PREPARE) return this.fail(base, ClickError.ACTION_NOT_FOUND);
		if (!this.isSignValid(req, '')) return this.fail(base, ClickError.SIGN_FAILED);

		const order = await this.findOrder(req.merchant_trans_id);
		if (!order) return this.fail(base, ClickError.ORDER_NOT_FOUND);
		if (order.paymentStatus === PaymentStatus.PAID) return this.fail(base, ClickError.ALREADY_PAID);
		if (order.orderStatus === OrderStatus.CANCELLED) return this.fail(base, ClickError.TRANSACTION_CANCELLED);
		if (!this.amountMatches(order, req.amount)) return this.fail(base, ClickError.INVALID_AMOUNT);

		// Bir buyurtma uchun takroriy prepare — o'sha prepare_id qaytariladi
		const existing = order.clickTxn;
		if (existing && existing.transId === req.click_trans_id) {
			return { ...base, merchant_prepare_id: existing.prepareId };
		}
		const prepareId = Date.now();
		await this.orderModel
			.updateOne({ _id: order._id }, { clickTxn: { transId: req.click_trans_id, prepareId } })
			.exec();
		return { ...base, merchant_prepare_id: prepareId };
	}

	public async complete(req: ClickRequest): Promise<ClickResponse> {
		const base = this.baseResponse(req);
		if (Number(req.action) !== ClickAction.COMPLETE) return this.fail(base, ClickError.ACTION_NOT_FOUND);
		if (!this.isSignValid(req, req.merchant_prepare_id ?? '')) return this.fail(base, ClickError.SIGN_FAILED);

		const order = await this.findOrder(req.merchant_trans_id);
		if (!order) return this.fail(base, ClickError.ORDER_NOT_FOUND);
		const txn = order.clickTxn;
		if (!txn || txn.transId !== req.click_trans_id || String(txn.prepareId) !== req.merchant_prepare_id) {
			return this.fail(base, ClickError.TRANSACTION_NOT_FOUND);
		}
		if (order.paymentStatus === PaymentStatus.PAID) return this.fail(base, ClickError.ALREADY_PAID);
		if (order.orderStatus === OrderStatus.CANCELLED) return this.fail(base, ClickError.TRANSACTION_CANCELLED);
		if (!this.amountMatches(order, req.amount)) return this.fail(base, ClickError.INVALID_AMOUNT);

		// Click tomonda to'lov o'tmagan (error < 0) — buyurtmani bekor qilamiz
		if (Number(req.error) < 0) {
			await this.orderService.cancelUnpaidOrder(order._id as ObjectId);
			return this.fail(base, ClickError.TRANSACTION_CANCELLED);
		}

		await this.orderService.markPaid(order._id as ObjectId, `CLICK-${req.click_trans_id}`);
		this.logger.log(`Click paid order ${order.orderId}`);
		return { ...base, merchant_confirm_id: txn.prepareId };
	}

	/** md5(click_trans_id + service_id + SECRET_KEY + merchant_trans_id + [merchant_prepare_id] + amount + action + sign_time) */
	private isSignValid(req: ClickRequest, prepareId: string): boolean {
		const secret = process.env.CLICK_SECRET_KEY;
		if (!secret || !req.sign_string || req.service_id !== process.env.CLICK_SERVICE_ID) return false;
		const payload = [
			req.click_trans_id,
			req.service_id,
			secret,
			req.merchant_trans_id,
			prepareId,
			req.amount,
			req.action,
			req.sign_time,
		].join('');
		const expected = Buffer.from(createHash('md5').update(payload).digest('hex'));
		const given = Buffer.from(req.sign_string);
		return given.length === expected.length && timingSafeEqual(given, expected);
	}

	private findOrder(orderId: string | undefined): Promise<ClickOrder | null> {
		if (typeof orderId !== 'string') return Promise.resolve(null);
		return this.orderModel.findOne({ orderId, paymentMethod: PaymentMethod.CLICK }).lean<ClickOrder>().exec();
	}

	private amountMatches(order: ClickOrder, amount: string | undefined): boolean {
		return Math.abs(Number(amount) - (order.paymentAmount ?? 0)) < AMOUNT_EPSILON;
	}

	private baseResponse(req: ClickRequest): ClickResponse {
		return {
			click_trans_id: req.click_trans_id ?? null,
			merchant_trans_id: req.merchant_trans_id ?? null,
			error: ClickError.SUCCESS,
			error_note: ERROR_NOTES[ClickError.SUCCESS],
		};
	}

	private fail(base: ClickResponse, error: ClickError): ClickResponse {
		return { ...base, error, error_note: ERROR_NOTES[error] };
	}
}
