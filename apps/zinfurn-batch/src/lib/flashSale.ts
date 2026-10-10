import { effectivePrice, PriceSource } from '../../../zinfurn-api/src/libs/pricing';

/**
 * Doimiy flash sale: har bir ACTIVE mahsulot har doim chegirmada turadi.
 * Aksiya tugagan (yoki hali boshlanmagan) mahsulotga darrov yangi oyna beriladi.
 * Muddatlar tasodifiy bo'lgani uchun aksiyalar har xil kunda tugaydi — hammasi birdan almashmaydi.
 */
export const SALE_MIN_DAYS = 15;
export const SALE_MAX_DAYS = 25;
export const DISCOUNT_MIN_PERCENT = 8;
export const DISCOUNT_MAX_PERCENT = 22;

const DAY_MS = 24 * 60 * 60 * 1000;
const PERCENT = 100;

/** Narxlar 47 dan 2200 gacha — yaxlitlash qadami narxning o'ziga qarab, kichik narx nolga tushmasin */
const roundPrice = (value: number): number => {
	const step = value >= 10000 ? 1000 : value >= 1000 ? 100 : value >= 100 ? 10 : 1;
	return Math.max(step, Math.round(value / step) * step);
};

const randomBetween = (min: number, max: number, random: () => number): number => min + random() * (max - min);

/** Hozir chegirma ko'rinib turibdimi — buyurtma narxi bilan bir xil qoida */
export const isSaleActive = (property: PriceSource, now: number): boolean =>
	effectivePrice(property, now) < property.propertyPrice;

export interface SaleWindow {
	propertyIsOnSale: true;
	propertySalePrice: number;
	propertySaleStartsAt: Date;
	propertySaleExpiresAt: Date;
}

export const buildSaleWindow = (price: number, now: number, random: () => number = Math.random): SaleWindow | null => {
	const discount = Math.round(randomBetween(DISCOUNT_MIN_PERCENT, DISCOUNT_MAX_PERCENT, random));
	const salePrice = roundPrice(price * (1 - discount / PERCENT));
	// Juda arzon mahsulotda yaxlitlash chegirmani yo'qotishi mumkin — unda aksiya qo'yilmaydi
	if (salePrice >= price) return null;
	const days = randomBetween(SALE_MIN_DAYS, SALE_MAX_DAYS, random);
	return {
		propertyIsOnSale: true,
		propertySalePrice: salePrice,
		propertySaleStartsAt: new Date(now),
		propertySaleExpiresAt: new Date(now + days * DAY_MS),
	};
};
