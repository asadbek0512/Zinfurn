/**
 * Flash sale'larni navbatma-navbat joylashtirish.
 *
 * Bosh sahifadagi flash sale bo'limi bir vaqtda 3 ta chegirmadagi mahsulotni
 * ko'rsatadi. Hammasining muddati bir vaqtda tugasa bo'lim bo'sh qolib ketadi,
 * shuning uchun mahsulotlar 3 tadan guruhlarga bo'linib, har guruhga ketma-ket
 * oyna beriladi:
 *
 *   1-guruh: bugundan  0 → 12-kun
 *   2-guruh:          12 → 24-kun
 *   3-guruh:          24 → 36-kun   ...
 *
 * `propertySaleStartsAt` kelgunicha mahsulot chegirmada ko'rinmaydi, ya'ni bir
 * guruh tugashi bilan keyingisi o'zi ochiladi va sahifa hech qachon bo'shamaydi.
 *
 * Ishga tushirish (zinfurn backend papkasidan):
 *   node scripts/staggerFlashSales.js --dry     # faqat ko'rsatadi, yozmaydi
 *   node scripts/staggerFlashSales.js           # DB'ga yozadi
 */
const { MongoClient } = require('mongodb');
require('dotenv').config();

const SALE_WINDOW_DAYS = 12; // 10-15 kun oralig'ida
const PRODUCTS_PER_WINDOW = 3; // bosh sahifada bir vaqtda 3 ta kart ko'rinadi
const DISCOUNT_PERCENT = 15; // sale narxi bo'lmagan mahsulotlar uchun
const DAY_MS = 24 * 60 * 60 * 1000;

const dryRun = process.argv.includes('--dry');

const roundPrice = (value) => Math.round(value / 1000) * 1000;
const asDate = (date) => date.toISOString().slice(0, 10);

(async () => {
	const uri = process.env.MONGO_PROD || process.env.MONGO_DEV;
	if (!uri) throw new Error('MONGO_PROD / MONGO_DEV .env da topilmadi');

	const client = new MongoClient(uri);
	await client.connect();
	const properties = client.db().collection('properties');

	// Faqat sotuvdagi mahsulotlar; eng ko'p ko'rilganlari birinchi navbatda sale'ga tushadi
	const candidates = await properties
		.find({ propertyStatus: 'ACTIVE' })
		.sort({ propertyViews: -1, createdAt: -1 })
		.project({ propertyTitle: 1, propertyPrice: 1, propertySalePrice: 1 })
		.toArray();

	if (!candidates.length) {
		console.log('ACTIVE mahsulot topilmadi.');
		await client.close();
		return;
	}

	const now = Date.now();
	const operations = [];
	const preview = [];

	candidates.forEach((product, index) => {
		const windowIndex = Math.floor(index / PRODUCTS_PER_WINDOW);
		const startsAt = new Date(now + windowIndex * SALE_WINDOW_DAYS * DAY_MS);
		const expiresAt = new Date(now + (windowIndex + 1) * SALE_WINDOW_DAYS * DAY_MS);
		const salePrice =
			product.propertySalePrice && product.propertySalePrice < product.propertyPrice
				? product.propertySalePrice
				: roundPrice(product.propertyPrice * (1 - DISCOUNT_PERCENT / 100));

		operations.push({
			updateOne: {
				filter: { _id: product._id },
				update: {
					$set: {
						propertyIsOnSale: true,
						propertySalePrice: salePrice,
						propertySaleStartsAt: startsAt,
						propertySaleExpiresAt: expiresAt,
					},
				},
			},
		});
		preview.push({
			guruh: windowIndex + 1,
			mahsulot: product.propertyTitle,
			narx: product.propertyPrice,
			saleNarx: salePrice,
			boshlanadi: asDate(startsAt),
			tugaydi: asDate(expiresAt),
		});
	});

	const windows = Math.ceil(candidates.length / PRODUCTS_PER_WINDOW);
	const coverageDays = windows * SALE_WINDOW_DAYS;

	console.table(preview.slice(0, 15));
	console.log(
		`Jami ${candidates.length} mahsulot, ${windows} guruh × ${SALE_WINDOW_DAYS} kun ` +
			`= ${coverageDays} kun (~${(coverageDays / 30).toFixed(1)} oy) uzluksiz flash sale.`,
	);

	if (dryRun) {
		console.log('--dry rejimi: DB o‘zgartirilmadi.');
	} else {
		const result = await properties.bulkWrite(operations);
		console.log(`Yangilandi: ${result.modifiedCount} ta mahsulot.`);
	}

	await client.close();
})().catch((error) => {
	console.error(error);
	process.exit(1);
});
