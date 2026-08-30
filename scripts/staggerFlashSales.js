/**
 * Flash sale'larni tabiiy, bittalab almashadigan qilib joylashtirish.
 *
 * Guruhlab emas — har mahsulotga o'z oynasi beriladi va oynalar bir-biriga
 * surilib ketadi. Natijada har doim uchtasi aktiv turadi, muddatlari esa
 * har xil bo'ladi: biri tugaganda faqat o'sha bittasi yangisiga almashadi.
 *
 *   1-mahsulot: ... → 5-kun     (hozir aktiv, eng kam vaqt qolgan)
 *   2-mahsulot: ... → 10-kun    (hozir aktiv)
 *   3-mahsulot: ... → 15-kun    (hozir aktiv)
 *   4-mahsulot: 5-kun → 20-kun  (1-mahsulot o'rniga chiqadi)   ...
 *
 * Har mahsulot SALE_DURATION_DAYS kun sotuvda turadi, lekin qo'shnisidan
 * SALE_STEP_DAYS kun kechikib tugaydi. STEP = DURATION / 3 bo'lgani uchun
 * ekranda doim aynan 3 ta chegirma bo'ladi.
 *
 * Ishga tushirish (zinfurn backend papkasidan):
 *   node scripts/staggerFlashSales.js --dry     # faqat ko'rsatadi, yozmaydi
 *   node scripts/staggerFlashSales.js           # DB'ga yozadi
 */
const { MongoClient } = require('mongodb');
require('dotenv').config();

const SALE_DURATION_DAYS = 15; // bitta mahsulot chegirmada turadigan muddat (10-15 kun)
const VISIBLE_AT_ONCE = 3; // bosh sahifada bir vaqtda ko'rinadigan kart soni
const SALE_STEP_DAYS = SALE_DURATION_DAYS / VISIBLE_AT_ONCE; // tugash sanalari orasidagi farq
const JITTER_HOURS = 10; // sanalar mexanik ko'rinmasligi uchun kichik tasodifiy siljish
const DISCOUNT_MIN = 8; // chegirma foizi shu oraliqda tasodifiy tanlanadi
const DISCOUNT_MAX = 22;
const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

const dryRun = process.argv.includes('--dry');

// Narxlar 47 dan 2200 gacha — yaxlitlash qadami narxning o'ziga qarab tanlanadi,
// aks holda kichik narxlar nolga tushib qoladi.
const roundPrice = (value) => {
	const step = value >= 10000 ? 1000 : value >= 1000 ? 100 : value >= 100 ? 10 : 1;
	return Math.max(step, Math.round(value / step) * step);
};

const asDateTime = (date) => date.toISOString().slice(0, 16).replace('T', ' ');
const randomBetween = (min, max) => min + Math.random() * (max - min);

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
		.project({ propertyTitle: 1, propertyPrice: 1 })
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
		// Tugash sanalari bir xil qadam bilan suriladi, ustiga kichik jitter qo'shiladi
		const jitter = randomBetween(-JITTER_HOURS, JITTER_HOURS) * HOUR_MS;
		const expiresAt = new Date(now + (index + 1) * SALE_STEP_DAYS * DAY_MS + jitter);
		// Boshlanish sanasi orqaga hisoblanadi — birinchi uchtasi o'tmishda, ya'ni allaqachon aktiv
		const startsAt = new Date(expiresAt.getTime() - SALE_DURATION_DAYS * DAY_MS);
		const discount = Math.round(randomBetween(DISCOUNT_MIN, DISCOUNT_MAX));
		const salePrice = roundPrice(product.propertyPrice * (1 - discount / 100));

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
			mahsulot: product.propertyTitle,
			narx: product.propertyPrice,
			saleNarx: salePrice,
			chegirma: `${Math.round(((product.propertyPrice - salePrice) / product.propertyPrice) * 100)}%`,
			boshlanadi: asDateTime(startsAt),
			tugaydi: asDateTime(expiresAt),
			holat: startsAt.getTime() <= now ? 'AKTIV' : 'navbatda',
		});
	});

	const coverageDays = candidates.length * SALE_STEP_DAYS;

	console.table(preview.slice(0, 10));
	console.log(
		`Jami ${candidates.length} mahsulot · har biri ${SALE_DURATION_DAYS} kun · ` +
			`har ${SALE_STEP_DAYS} kunda bittasi almashadi · doim ${VISIBLE_AT_ONCE} ta aktiv · ` +
			`qamrov ${coverageDays} kun (~${(coverageDays / 30).toFixed(1)} oy).`,
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
