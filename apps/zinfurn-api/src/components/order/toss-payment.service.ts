import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Message } from '../../libs/enums/common_enum';

const TOSS_API_URL = 'https://api.tosspayments.com/v1/payments';
const TOSS_CONFIRM_URL = `${TOSS_API_URL}/confirm`;
export const TOSS_DONE_STATUS = 'DONE';
/** Toss tasdiqlash so'rovi uchun kutish chegarasi */
const TOSS_TIMEOUT_MS = 10000;

export interface TossConfirmResult {
	paymentKey: string;
	orderId: string;
	status: string;
	totalAmount: number;
}

interface TossErrorBody {
	code?: string;
	message?: string;
}

/**
 * Toss Payments bilan server-server aloqa. Secret key faqat shu yerda ishlatiladi
 * (TOSS_SECRET_KEY, .env) — frontend'ga hech qachon chiqmaydi.
 */
@Injectable()
export class TossPaymentService {
	private readonly logger = new Logger(TossPaymentService.name);

	/**
	 * orderId bo'yicha Toss'dagi to'lov holatini oladi (reconciliation uchun).
	 * To'lov yo'q yoki xato bo'lsa null qaytaradi.
	 */
	public async findByOrderId(orderId: string): Promise<TossConfirmResult | null> {
		const secretKey = process.env.TOSS_SECRET_KEY;
		if (!secretKey) return null;
		try {
			const response = await fetch(`${TOSS_API_URL}/orders/${encodeURIComponent(orderId)}`, {
				headers: { Authorization: this.authHeader(secretKey) },
				signal: AbortSignal.timeout(TOSS_TIMEOUT_MS),
			});
			if (!response.ok) return null;
			return (await response.json()) as TossConfirmResult;
		} catch (err) {
			this.logger.warn(`Toss lookup failed for ${orderId}: ${(err as Error).message}`);
			return null;
		}
	}

	public async confirm(paymentKey: string, orderId: string, amount: number): Promise<TossConfirmResult> {
		const secretKey = process.env.TOSS_SECRET_KEY;
		if (!secretKey) {
			this.logger.error('TOSS_SECRET_KEY is not set');
			throw new BadRequestException(Message.PAYMENT_FAILED);
		}

		const response = await fetch(TOSS_CONFIRM_URL, {
			method: 'POST',
			headers: {
				Authorization: this.authHeader(secretKey),
				'Content-Type': 'application/json',
				// Bir xil orderId qayta yuborilsa Toss ikkinchi marta yechmaydi
				'Idempotency-Key': orderId,
			},
			body: JSON.stringify({ paymentKey, orderId, amount }),
			signal: AbortSignal.timeout(TOSS_TIMEOUT_MS),
		});

		if (!response.ok) {
			const body = (await response.json().catch(() => ({}))) as TossErrorBody;
			// Toss xabari koreyscha keladi — foydalanuvchiga umumiy xabar, kod log'ga
			this.logger.warn(`Toss confirm failed: ${body.code ?? response.status} ${body.message ?? ''}`);
			throw new BadRequestException(Message.PAYMENT_FAILED);
		}

		const result = (await response.json()) as TossConfirmResult;
		if (result.status !== TOSS_DONE_STATUS || result.totalAmount !== amount || result.orderId !== orderId) {
			this.logger.warn(`Toss confirm mismatch for ${orderId}: ${result.status}`);
			throw new BadRequestException(Message.PAYMENT_FAILED);
		}
		return result;
	}

	private authHeader(secretKey: string): string {
		return `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`;
	}
}
