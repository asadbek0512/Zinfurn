/** Narx hisoblash uchun kerakli Product maydonlari */
export interface PriceSource {
	productPrice: number;
	productSalePrice?: number;
	productIsOnSale?: boolean;
	productSaleStartsAt?: Date;
	productSaleExpiresAt?: Date;
}

/**
 * Flash sale oynasi ochiq bo'lsa chegirma narxi, aks holda asosiy narx.
 * Frontend'dagi libs/utils/sale.ts bilan bir xil qoida — buyurtma summasi shunga tayanadi.
 */
export const effectivePrice = (product: PriceSource, now: number = Date.now()): number => {
	const { productIsOnSale, productSalePrice, productSaleStartsAt, productSaleExpiresAt } = product;
	if (!productIsOnSale || !productSalePrice) return product.productPrice;
	if (productSaleStartsAt && productSaleStartsAt.getTime() > now) return product.productPrice;
	if (productSaleExpiresAt && productSaleExpiresAt.getTime() <= now) return product.productPrice;
	return productSalePrice;
};
