/** Narx hisoblash uchun kerakli Property maydonlari */
export interface PriceSource {
	propertyPrice: number;
	propertySalePrice?: number;
	propertyIsOnSale?: boolean;
	propertySaleStartsAt?: Date;
	propertySaleExpiresAt?: Date;
}

/**
 * Flash sale oynasi ochiq bo'lsa chegirma narxi, aks holda asosiy narx.
 * Frontend'dagi libs/utils/sale.ts bilan bir xil qoida — buyurtma summasi shunga tayanadi.
 */
export const effectivePrice = (property: PriceSource, now: number = Date.now()): number => {
	const { propertyIsOnSale, propertySalePrice, propertySaleStartsAt, propertySaleExpiresAt } = property;
	if (!propertyIsOnSale || !propertySalePrice) return property.propertyPrice;
	if (propertySaleStartsAt && propertySaleStartsAt.getTime() > now) return property.propertyPrice;
	if (propertySaleExpiresAt && propertySaleExpiresAt.getTime() <= now) return property.propertyPrice;
	return propertySalePrice;
};
