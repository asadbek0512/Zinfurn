import { PaymentMethod } from '../../libs/enums/payment.enum';

/** Narxlar USD'da saqlanadi; Payme/Click faqat so'm qabul qiladi */
export const UZS_CURRENCY = 'UZS';
const DEFAULT_UZS_PER_USD = 12700;
export const uzsPerUsd = (): number => Number(process.env.UZS_PER_USD) || DEFAULT_UZS_PER_USD;

/** Payme summani tiyinda yuboradi (1 so'm = 100 tiyin) */
export const TIYIN_PER_SUM = 100;

const PAYME_CHECKOUT_URL = 'https://checkout.paycom.uz';
const PAYME_TEST_CHECKOUT_URL = 'https://test.paycom.uz';
const CLICK_CHECKOUT_URL = 'https://my.click.uz/services/pay';
const DEFAULT_FRONTEND_URL = 'https://zinfurn.uz';
/** Haqiqiy to'lovdan keyin qaytiladigan sahifa — buyurtma holati u yerda ko'rinadi */
const PAYMENT_RETURN_PATH = '/mypage?category=myOrders';
/** Kalit yo'q bo'lsa ochiladigan o'z test to'lov sahifamiz */
const DEMO_PAYMENT_PATH = '/payment/demo';

export const UZ_PROVIDERS: PaymentMethod[] = [PaymentMethod.PAYME, PaymentMethod.CLICK];

/** Merchant kalitlari .env'da bo'lsa haqiqiy rejim, aks holda demo */
export const isPaymeConfigured = (): boolean => !!(process.env.PAYME_MERCHANT_ID && process.env.PAYME_KEY);
export const isClickConfigured = (): boolean =>
	!!(process.env.CLICK_SERVICE_ID && process.env.CLICK_MERCHANT_ID && process.env.CLICK_SECRET_KEY);

export const isProviderConfigured = (method: PaymentMethod): boolean =>
	method === PaymentMethod.PAYME ? isPaymeConfigured() : method === PaymentMethod.CLICK ? isClickConfigured() : false;

const frontendUrl = (): string => (process.env.FRONTEND_URL || DEFAULT_FRONTEND_URL).split(',')[0].trim();

/** Payme checkout havolasi: parametrlar `;` bilan ulanib base64 qilinadi (Payme hujjati) */
const buildPaymeUrl = (orderId: string, amountSum: number): string => {
	const params = [
		`m=${process.env.PAYME_MERCHANT_ID}`,
		`ac.order_id=${orderId}`,
		`a=${amountSum * TIYIN_PER_SUM}`,
		`c=${frontendUrl()}${PAYMENT_RETURN_PATH}`,
	].join(';');
	const base = process.env.PAYME_TEST === 'true' ? PAYME_TEST_CHECKOUT_URL : PAYME_CHECKOUT_URL;
	return `${base}/${Buffer.from(params).toString('base64')}`;
};

const buildClickUrl = (orderId: string, amountSum: number): string => {
	const query = new URLSearchParams({
		service_id: process.env.CLICK_SERVICE_ID ?? '',
		merchant_id: process.env.CLICK_MERCHANT_ID ?? '',
		amount: String(amountSum),
		transaction_param: orderId,
		return_url: `${frontendUrl()}${PAYMENT_RETURN_PATH}`,
	});
	return `${CLICK_CHECKOUT_URL}?${query.toString()}`;
};

/** Foydalanuvchi yo'naltiriladigan to'lov sahifasi: kalit bo'lsa provayder, bo'lmasa demo */
export const buildPaymentUrl = (method: PaymentMethod, orderId: string, amountSum: number): string => {
	if (isProviderConfigured(method)) {
		return method === PaymentMethod.PAYME ? buildPaymeUrl(orderId, amountSum) : buildClickUrl(orderId, amountSum);
	}
	// amount faqat ko'rsatish uchun — demo tasdiq summani tekshirmaydi, buyurtma serverda
	const query = new URLSearchParams({ orderId, provider: method.toLowerCase(), amount: String(amountSum) });
	return `${DEMO_PAYMENT_PATH}?${query.toString()}`;
};
