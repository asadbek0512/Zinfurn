import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { timingSafeEqual } from 'crypto';
import { Order } from '../../libs/dto/order/order';
import { OrderStatus } from '../../libs/enums/order.enum';
import { PaymentMethod, PaymentStatus } from '../../libs/enums/payment.enum';
import { OrderService } from './order.service';
import { TIYIN_PER_SUM } from './payment-gateway.config';

/** Payme Merchant API (JSON-RPC 2.0) — https://developer.help.paycom.uz */
enum PaymeState {
	CREATED = 1,
	PERFORMED = 2,
	CANCELLED = -1,
	CANCELLED_AFTER_PERFORM = -2,
}

enum PaymeError {
	PARSE = -32700,
	METHOD_NOT_FOUND = -32601,
	UNAUTHORIZED = -32504,
	INVALID_AMOUNT = -31001,
	TRANSACTION_NOT_FOUND = -31003,
	CANNOT_PERFORM = -31008,
	ORDER_NOT_FOUND = -31050,
	ORDER_BUSY = -31051,
}

/** Payme tranzaksiyani 12 soatdan keyin yaratib bo'lmaydi/bajarib bo'lmaydi */
const PAYME_TX_TIMEOUT_MS = 12 * 60 * 60 * 1000;
/** CancelTransaction sababi: 4 = timeout */
const CANCEL_REASON_TIMEOUT = 4;
const PAYME_LOGIN = 'Paycom';
const STATEMENT_LIMIT = 1000;

const ERROR_MESSAGES: Record<PaymeError, string> = {
	[PaymeError.PARSE]: 'Invalid JSON-RPC request',
	[PaymeError.METHOD_NOT_FOUND]: 'Method not found',
	[PaymeError.UNAUTHORIZED]: 'Insufficient privileges',
	[PaymeError.INVALID_AMOUNT]: 'Invalid amount',
	[PaymeError.TRANSACTION_NOT_FOUND]: 'Transaction not found',
	[PaymeError.CANNOT_PERFORM]: 'Unable to perform operation',
	[PaymeError.ORDER_NOT_FOUND]: 'Order not found',
	[PaymeError.ORDER_BUSY]: 'Order is awaiting another payment',
};

interface PaymeTxn {
	id: string;
	time: number;
	createTime: number;
	performTime: number;
	cancelTime: number;
	state: PaymeState;
	reason: number | null;
}

type PaymeOrder = Order & { paymeTxn?: PaymeTxn };

export interface PaymeRequest {
	id?: number | string;
	method?: string;
	params?: {
		id?: string;
		time?: number;
		amount?: number;
		reason?: number;
		from?: number;
		to?: number;
		account?: { order_id?: string };
	};
}

export interface PaymeResponse {
	id: number | string | null;
	result?: Record<string, unknown>;
	error?: { code: number; message: { uz: string; ru: string; en: string }; data?: string };
}

class PaymeException extends Error {
	constructor(
		public readonly code: PaymeError,
		public readonly data?: string,
	) {
		super(ERROR_MESSAGES[code]);
	}
}

@Injectable()
export class PaymeService {
	private readonly logger = new Logger(PaymeService.name);

	constructor(
		@InjectModel('Order') private readonly orderModel: Model<PaymeOrder>,
		private readonly orderService: OrderService,
	) {}

	/** Basic auth: login "Paycom", parol = kassa kaliti (PAYME_KEY) */
	public isAuthorized(authHeader: string | undefined): boolean {
		const key = process.env.PAYME_KEY;
		if (!key || !authHeader?.startsWith('Basic ')) return false;
		const given = Buffer.from(authHeader.slice('Basic '.length), 'base64');
		const expected = Buffer.from(`${PAYME_LOGIN}:${key}`);
		return given.length === expected.length && timingSafeEqual(given, expected);
	}

	public async handle(body: PaymeRequest, authHeader: string | undefined): Promise<PaymeResponse> {
		const id = body?.id ?? null;
		try {
			if (!this.isAuthorized(authHeader)) throw new PaymeException(PaymeError.UNAUTHORIZED);
			if (!body?.method || !body.params) throw new PaymeException(PaymeError.PARSE);
			return { id, result: await this.dispatch(body.method, body.params) };
		} catch (err) {
			if (err instanceof PaymeException) {
				const message = err.message;
				return { id, error: { code: err.code, message: { uz: message, ru: message, en: message }, data: err.data } };
			}
			this.logger.error(`Payme ${body?.method} failed: ${(err as Error).message}`);
			throw err;
		}
	}

	private dispatch(method: string, params: NonNullable<PaymeRequest['params']>): Promise<Record<string, unknown>> {
		switch (method) {
			case 'CheckPerformTransaction':
				return this.checkPerform(params.account?.order_id, params.amount);
			case 'CreateTransaction':
				return this.createTransaction(params);
			case 'PerformTransaction':
				return this.performTransaction(params.id);
			case 'CancelTransaction':
				return this.cancelTransaction(params.id, params.reason);
			case 'CheckTransaction':
				return this.checkTransaction(params.id);
			case 'GetStatement':
				return this.getStatement(params.from, params.to);
			default:
				throw new PaymeException(PaymeError.METHOD_NOT_FOUND, method);
		}
	}

	/** Buyurtma Payme orqali to'lanadigan, to'lanmagan va summa tiyinda mos bo'lishi kerak */
	private async findPayableOrder(orderId: string | undefined, amount: number | undefined): Promise<PaymeOrder> {
		if (typeof orderId !== 'string') throw new PaymeException(PaymeError.ORDER_NOT_FOUND, 'order_id');
		const order = await this.orderModel
			.findOne({ orderId, paymentMethod: PaymentMethod.PAYME })
			.lean<PaymeOrder>()
			.exec();
		if (!order || order.paymentStatus !== PaymentStatus.UNPAID || order.orderStatus === OrderStatus.CANCELLED) {
			throw new PaymeException(PaymeError.ORDER_NOT_FOUND, 'order_id');
		}
		if (amount !== (order.paymentAmount ?? 0) * TIYIN_PER_SUM) throw new PaymeException(PaymeError.INVALID_AMOUNT);
		return order;
	}

	private async checkPerform(orderId: string | undefined, amount: number | undefined): Promise<Record<string, unknown>> {
		await this.findPayableOrder(orderId, amount);
		return { allow: true };
	}

	private async createTransaction(params: NonNullable<PaymeRequest['params']>): Promise<Record<string, unknown>> {
		const { id, time, amount, account } = params;
		if (typeof id !== 'string' || typeof time !== 'number') throw new PaymeException(PaymeError.PARSE);

		const existing = await this.findByTxnId(id);
		if (existing?.paymeTxn) {
			const txn = existing.paymeTxn;
			if (txn.state !== PaymeState.CREATED) throw new PaymeException(PaymeError.CANNOT_PERFORM);
			if (Date.now() - txn.createTime > PAYME_TX_TIMEOUT_MS) {
				await this.cancelTxn(existing, CANCEL_REASON_TIMEOUT);
				throw new PaymeException(PaymeError.CANNOT_PERFORM);
			}
			return this.txnReceipt(existing._id, txn);
		}

		if (Date.now() - time > PAYME_TX_TIMEOUT_MS) throw new PaymeException(PaymeError.CANNOT_PERFORM);
		const order = await this.findPayableOrder(account?.order_id, amount);
		if (order.paymeTxn?.state === PaymeState.CREATED) throw new PaymeException(PaymeError.ORDER_BUSY);

		const txn: PaymeTxn = { id, time, createTime: Date.now(), performTime: 0, cancelTime: 0, state: PaymeState.CREATED, reason: null };
		// Faqat ochiq tranzaksiyasi yo'q buyurtmaga yoziladi — parallel CreateTransaction'dan himoya
		const saved = await this.orderModel
			.findOneAndUpdate({ _id: order._id, 'paymeTxn.state': { $ne: PaymeState.CREATED } }, { paymeTxn: txn }, { new: true })
			.exec();
		if (!saved) throw new PaymeException(PaymeError.ORDER_BUSY);
		return this.txnReceipt(order._id, txn);
	}

	private async performTransaction(id: string | undefined): Promise<Record<string, unknown>> {
		const order = await this.requireTxn(id);
		const txn = order.paymeTxn as PaymeTxn;
		if (txn.state === PaymeState.PERFORMED) {
			return { transaction: String(order._id), perform_time: txn.performTime, state: txn.state };
		}
		if (txn.state !== PaymeState.CREATED) throw new PaymeException(PaymeError.CANNOT_PERFORM);
		if (Date.now() - txn.createTime > PAYME_TX_TIMEOUT_MS) {
			await this.cancelTxn(order, CANCEL_REASON_TIMEOUT);
			throw new PaymeException(PaymeError.CANNOT_PERFORM);
		}

		const performTime = Date.now();
		const updated = await this.orderModel
			.findOneAndUpdate(
				{ _id: order._id, 'paymeTxn.id': txn.id, 'paymeTxn.state': PaymeState.CREATED },
				{ 'paymeTxn.state': PaymeState.PERFORMED, 'paymeTxn.performTime': performTime },
				{ new: true },
			)
			.lean<PaymeOrder>()
			.exec();
		if (!updated?.paymeTxn) throw new PaymeException(PaymeError.CANNOT_PERFORM);
		await this.orderService.markPaid(order._id as ObjectId, txn.id);
		return { transaction: String(order._id), perform_time: updated.paymeTxn.performTime, state: PaymeState.PERFORMED };
	}

	private async cancelTransaction(id: string | undefined, reason: number | undefined): Promise<Record<string, unknown>> {
		const order = await this.requireTxn(id);
		const txn = order.paymeTxn as PaymeTxn;
		if (txn.state === PaymeState.CANCELLED || txn.state === PaymeState.CANCELLED_AFTER_PERFORM) {
			return { transaction: String(order._id), cancel_time: txn.cancelTime, state: txn.state };
		}
		const cancelled = await this.cancelTxn(order, reason ?? null);
		return { transaction: String(order._id), cancel_time: cancelled.cancelTime, state: cancelled.state };
	}

	private async checkTransaction(id: string | undefined): Promise<Record<string, unknown>> {
		const order = await this.requireTxn(id);
		const txn = order.paymeTxn as PaymeTxn;
		return {
			create_time: txn.createTime,
			perform_time: txn.performTime,
			cancel_time: txn.cancelTime,
			transaction: String(order._id),
			state: txn.state,
			reason: txn.reason,
		};
	}

	private async getStatement(from: number | undefined, to: number | undefined): Promise<Record<string, unknown>> {
		if (typeof from !== 'number' || typeof to !== 'number') throw new PaymeException(PaymeError.PARSE);
		const orders = await this.orderModel
			.find({ 'paymeTxn.createTime': { $gte: from, $lte: to } })
			.sort({ 'paymeTxn.createTime': 1 })
			.limit(STATEMENT_LIMIT)
			.lean<PaymeOrder[]>()
			.exec();
		const transactions = orders.map((order) => {
			const txn = order.paymeTxn as PaymeTxn;
			return {
				id: txn.id,
				time: txn.time,
				amount: (order.paymentAmount ?? 0) * TIYIN_PER_SUM,
				account: { order_id: order.orderId },
				create_time: txn.createTime,
				perform_time: txn.performTime,
				cancel_time: txn.cancelTime,
				transaction: String(order._id),
				state: txn.state,
				reason: txn.reason,
			};
		});
		return { transactions };
	}

	/**
	 * Tranzaksiyani bekor qiladi. Bajarilganidan keyin bekor qilish = pul qaytarildi:
	 * buyurtma CANCELLED, to'lov holati UNPAID'ga qaytadi.
	 */
	private async cancelTxn(order: PaymeOrder, reason: number | null): Promise<PaymeTxn> {
		const txn = order.paymeTxn as PaymeTxn;
		const wasPerformed = txn.state === PaymeState.PERFORMED;
		const state = wasPerformed ? PaymeState.CANCELLED_AFTER_PERFORM : PaymeState.CANCELLED;
		const cancelTime = Date.now();
		await this.orderModel
			.updateOne(
				{ _id: order._id, 'paymeTxn.id': txn.id },
				{ 'paymeTxn.state': state, 'paymeTxn.cancelTime': cancelTime, 'paymeTxn.reason': reason },
			)
			.exec();
		if (wasPerformed) {
			await this.orderModel
				.updateOne(
					{ _id: order._id },
					{ paymentStatus: PaymentStatus.UNPAID, orderStatus: OrderStatus.CANCELLED, cancelledAt: new Date() },
				)
				.exec();
			this.logger.warn(`Payme refunded order ${order.orderId}`);
		} else {
			await this.orderService.cancelUnpaidOrder(order._id as ObjectId);
		}
		return { ...txn, state, cancelTime, reason };
	}

	private findByTxnId(id: string): Promise<PaymeOrder | null> {
		return this.orderModel.findOne({ 'paymeTxn.id': id }).lean<PaymeOrder>().exec();
	}

	private async requireTxn(id: string | undefined): Promise<PaymeOrder> {
		const order = typeof id === 'string' ? await this.findByTxnId(id) : null;
		if (!order?.paymeTxn) throw new PaymeException(PaymeError.TRANSACTION_NOT_FOUND);
		return order;
	}

	private txnReceipt(orderDbId: unknown, txn: PaymeTxn): Record<string, unknown> {
		return { create_time: txn.createTime, transaction: String(orderDbId), state: txn.state };
	}
}
