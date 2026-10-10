import { buildSaleWindow, isSaleActive, isSoldOut, SALE_MAX_DAYS, SALE_MIN_DAYS } from './flashSale';

const DAY_MS = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 9, 10);

describe('flashSale', () => {
	it('yangi oyna hozirdan boshlanadi, 15-25 kun, narx 8-22% arzon', () => {
		for (const r of [0, 0.5, 0.999]) {
			const w = buildSaleWindow(1000, NOW, () => r);
			expect(w).not.toBeNull();
			const days = (w!.propertySaleExpiresAt.getTime() - NOW) / DAY_MS;
			expect(days).toBeGreaterThanOrEqual(SALE_MIN_DAYS);
			expect(days).toBeLessThanOrEqual(SALE_MAX_DAYS);
			expect(w!.propertySalePrice).toBeGreaterThanOrEqual(780);
			expect(w!.propertySalePrice).toBeLessThanOrEqual(920);
			expect(isSaleActive({ propertyPrice: 1000, ...w! }, NOW)).toBe(true);
		}
	});

	it('tugagan yoki hali boshlanmagan aksiya — aktiv emas', () => {
		const base = { propertyPrice: 100, propertyIsOnSale: true, propertySalePrice: 90 };
		expect(isSaleActive({ ...base, propertySaleExpiresAt: new Date(NOW - 1) }, NOW)).toBe(false);
		expect(isSaleActive({ ...base, propertySaleStartsAt: new Date(NOW + DAY_MS) }, NOW)).toBe(false);
		expect(isSaleActive({ ...base, propertySaleExpiresAt: new Date(NOW + DAY_MS) }, NOW)).toBe(true);
	});

	it('juda arzon mahsulotda chegirma yo\'qolsa — aksiya qo\'yilmaydi', () => {
		expect(buildSaleWindow(1, NOW, () => 0)).toBeNull();
	});

	it('stock 0 yoki inStock=false — tugagan, null — cheksiz', () => {
		expect(isSoldOut({ propertyStock: 0 })).toBe(true);
		expect(isSoldOut({ propertyInStock: false, propertyStock: null })).toBe(true);
		expect(isSoldOut({ propertyStock: null })).toBe(false);
		expect(isSoldOut({ propertyStock: 3 })).toBe(false);
	});
});
