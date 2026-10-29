/**
 * property -> product rename: DB migratsiyasi (kod rename'i bilan birga ishlatiladi).
 *
 * Nima qiladi:
 *   1. `properties` collection'ini `products` ga qayta nomlaydi
 *   2. Barcha collection'larda `property*` / `*Property*` / `*Properties` key'larini `product*` ga
 *      o'zgartiradi (ichma-ich obyekt va array'lar ham, masalan orders.orderItems[].propertyId)
 *   3. Enum qiymatlari: PROPERTY / REPAIR_PROPERTY / PROPERTY_QA -> PRODUCT / ... (faqat *Group va kind field'larida)
 *   4. Rasm yo'llari: `uploads/property/` -> `uploads/product/`
 *   5. Eski key'lardagi index'larni o'chirib, yangi key bilan qayta yaratadi
 *      (hech bir doc'da bo'lmagan field'dagi stale index qayta yaratilmaydi)
 *
 * Idempotent: ikkinchi marta ishlatilsa hech narsa o'zgarmaydi. --reverse aynan teskarisini qiladi.
 *
 * Ishga tushirish (zinfurn backend papkasidan):
 *   node scripts/migrations/renamePropertyToProduct.js --env MONGO_DEV              # dry run
 *   node scripts/migrations/renamePropertyToProduct.js --env MONGO_DEV --apply      # yozadi
 *   node scripts/migrations/renamePropertyToProduct.js --env MONGO_DEV --apply --reverse
 */
const { MongoClient } = require('mongodb');
require('dotenv').config();

const BATCH_SIZE = 500;
const OLD_COLLECTION = 'properties';
const NEW_COLLECTION = 'products';
const ENUM_FIELD = /(Group|^kind)$/;

const FORWARD_WORDS = [
	['PROPERTIES', 'PRODUCTS'], ['Properties', 'Products'], ['properties', 'products'],
	['PROPERTY', 'PRODUCT'], ['Property', 'Product'], ['property', 'product'],
];
const REVERSE_WORDS = FORWARD_WORDS.map(([a, b]) => [b, a]);
// REPAIRPROPERTY — eski (underscore'siz) yetim qiymat, kod uni o'qimaydi; faqat nomi almashadi
const FORWARD_ENUMS = { PROPERTY: 'PRODUCT', REPAIR_PROPERTY: 'REPAIR_PRODUCT', PROPERTY_QA: 'PRODUCT_QA', REPAIRPROPERTY: 'REPAIRPRODUCT' };
const REVERSE_ENUMS = Object.fromEntries(Object.entries(FORWARD_ENUMS).map(([a, b]) => [b, a]));
const FORWARD_PATH = ['uploads/property/', 'uploads/product/'];

// Reverse faqat migratsiya yaratgan key'larni qaytaradi — boshqa "product" so'zli key'larga tegmaydi
const NEW_KEY = /^(product[A-Z]\w*|repairProduct[A-Z]\w*|memberProducts)$/;
const OLD_KEY = /propert/i;

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const REVERSE = args.includes('--reverse');
const ENV_NAME = args[args.indexOf('--env') + 1];

const words = REVERSE ? REVERSE_WORDS : FORWARD_WORDS;
const enums = REVERSE ? REVERSE_ENUMS : FORWARD_ENUMS;
const [pathFrom, pathTo] = REVERSE ? [...FORWARD_PATH].reverse() : FORWARD_PATH;
const [fromColl, toColl] = REVERSE ? [NEW_COLLECTION, OLD_COLLECTION] : [OLD_COLLECTION, NEW_COLLECTION];
const shouldRenameKey = (k) => (REVERSE ? NEW_KEY.test(k) : OLD_KEY.test(k));

const renameKey = (k) => {
	if (!shouldRenameKey(k)) return k;
	return words.reduce((s, [a, b]) => s.split(a).join(b), k);
};

const isPlain = (v) => v !== null && typeof v === 'object' && !v._bsontype && !(v instanceof Date) && !Buffer.isBuffer(v);

const stats = { keys: {}, enums: {}, paths: 0, conflicts: [], suspicious: {} };
const bump = (obj, k) => (obj[k] = (obj[k] || 0) + 1);

/** Hujjatni o'zgartirilgan nusxasini qaytaradi; o'zgarish bo'lsa ctx.changed = true */
const transform = (value, field, ctx, where) => {
	if (typeof value === 'string') {
		if (ENUM_FIELD.test(field) && enums[value]) {
			ctx.changed = true;
			bump(stats.enums, `${field}: ${value}`);
			return enums[value];
		}
		if (value.includes(pathFrom)) {
			ctx.changed = true;
			stats.paths++;
			return value.split(pathFrom).join(pathTo);
		}
		if (!REVERSE && /^[A-Z_]*PROPERT[A-Z_]*$/.test(value)) bump(stats.suspicious, `${where}.${field}=${value}`);
		return value;
	}
	if (Array.isArray(value)) return value.map((v) => transform(v, field, ctx, where));
	if (!isPlain(value)) return value;
	const out = {};
	for (const [k, v] of Object.entries(value)) {
		const nk = renameKey(k);
		if (nk !== k) {
			ctx.changed = true;
			bump(stats.keys, `${where}: ${k} -> ${nk}`);
			if (nk in value) stats.conflicts.push(`${where} _id=${ctx.id}: both ${k} and ${nk}`);
		}
		out[nk] = transform(v, nk, ctx, where);
	}
	return out;
};

const renameCollection = async (db, write) => {
	const names = (await db.listCollections({}, { nameOnly: true }).toArray()).map((c) => c.name);
	if (!names.includes(fromColl)) {
		console.log(`collection: '${fromColl}' yo'q — o'tkazildi (allaqachon migratsiya qilingan?)`);
		return;
	}
	if (names.includes(toColl)) {
		const n = await db.collection(toColl).countDocuments();
		if (n > 0) throw new Error(`'${fromColl}' ham, '${toColl}' (${n} doc) ham bor — qo'lda tekshiring`);
		console.log(`collection: bo'sh '${toColl}' o'chiriladi (Mongoose yaratgan bo'lishi mumkin)`);
		if (write) await db.collection(toColl).drop();
	}
	console.log(`collection: ${fromColl} -> ${toColl}`);
	if (write) await db.collection(fromColl).rename(toColl);
};

/** Renamed key'lardagi index'larni qaytaradi: [{ name, newKey, options }] */
const indexesToRebuild = async (coll) => {
	const out = [];
	for (const idx of await coll.indexes()) {
		if (idx.name === '_id_') continue;
		const fields = Object.keys(idx.key);
		const newFields = fields.map((f) => f.split('.').map(renameKey).join('.'));
		if (fields.join() === newFields.join()) continue;
		const newKey = Object.fromEntries(newFields.map((f, i) => [f, idx.key[fields[i]]]));
		const options = {};
		for (const o of ['unique', 'sparse', 'expireAfterSeconds', 'partialFilterExpression']) {
			if (idx[o] !== undefined) options[o] = idx[o];
		}
		out.push({ name: idx.name, newKey, options });
	}
	return out;
};

const migrateCollection = async (db, name, write) => {
	const coll = db.collection(name);
	const rebuild = await indexesToRebuild(coll);
	if (!write) for (const r of rebuild) console.log(`  index ${name}.${r.name} -> ${JSON.stringify(r.newKey)} ${JSON.stringify(r.options)}`);
	if (write) for (const r of rebuild) await coll.dropIndex(r.name);

	let ops = [];
	let changedDocs = 0;
	for await (const doc of coll.find({})) {
		const ctx = { changed: false, id: String(doc._id) };
		const next = transform(doc, '', ctx, name);
		if (!ctx.changed) continue;
		changedDocs++;
		ops.push({ replaceOne: { filter: { _id: doc._id }, replacement: next } });
		if (ops.length >= BATCH_SIZE) {
			if (write) await coll.bulkWrite(ops, { ordered: true });
			ops = [];
		}
	}
	if (write && ops.length) await coll.bulkWrite(ops, { ordered: true });
	if (changedDocs) console.log(`  ${name}: ${changedDocs} doc ${write ? "o'zgardi" : "o'zgaradi"}`);

	if (write) {
		const existing = (await coll.indexes()).map((i) => JSON.stringify(i.key));
		for (const r of rebuild) {
			if (existing.includes(JSON.stringify(r.newKey))) continue;
			const missing = [];
			for (const f of Object.keys(r.newKey)) if (!(await coll.countDocuments({ [f]: { $exists: true } }, { limit: 1 }))) missing.push(f);
			if (missing.length && (await coll.estimatedDocumentCount())) {
				console.log(`  index ${name}.${r.name}: stale (${missing.join()} hech qayerda yo'q) — qayta yaratilmadi`);
				continue;
			}
			await coll.createIndex(r.newKey, r.options);
		}
	}
};

const main = async () => {
	if (!ENV_NAME || !process.env[ENV_NAME]) {
		console.error('--env MONGO_DEV yoki --env MONGO_PROD bering (.env dagi nom)');
		process.exit(1);
	}
	console.log(`${APPLY ? 'APPLY' : 'DRY RUN'} · ${REVERSE ? 'REVERSE (product -> property)' : 'FORWARD (property -> product)'} · ${ENV_NAME}`);
	const client = new MongoClient(process.env[ENV_NAME]);
	await client.connect();
	try {
		const db = client.db();
		console.log(`db: ${db.databaseName}`);
		const listNames = async () =>
			(await db.listCollections({}, { nameOnly: true }).toArray()).map((c) => c.name).filter((n) => !n.startsWith('system.'));

		// Har doim avval dry pass: conflict bo'lsa hech narsa yozilmaydi
		console.log('\n— dry pass —');
		await renameCollection(db, false);
		for (const n of await listNames()) await migrateCollection(db, n, false);
		if (APPLY && stats.conflicts.length) throw new Error(`${stats.conflicts.length} conflict topildi — hech narsa yozilmadi:\n${stats.conflicts.slice(0, 20).join('\n')}`);
		if (APPLY) {
			console.log('\n— write pass —');
			Object.assign(stats, { keys: {}, enums: {}, paths: 0, conflicts: [], suspicious: {} });
			await renameCollection(db, true);
			for (const n of await listNames()) await migrateCollection(db, n, true);
		}

		console.log('\nkey rename:');
		for (const [k, n] of Object.entries(stats.keys)) console.log(`  ${k}  (${n})`);
		console.log('enum:');
		for (const [k, n] of Object.entries(stats.enums)) console.log(`  ${k}  (${n})`);
		console.log(`path '${pathFrom}' -> '${pathTo}': ${stats.paths}`);
		const sus = Object.entries(stats.suspicious);
		if (sus.length) {
			console.log('DIQQAT — tanilmagan PROPERTY qiymati (o\'zgartirilmadi):');
			for (const [k, n] of sus) console.log(`  ${k}  (${n})`);
		}
		if (stats.conflicts.length) {
			console.log('CONFLICT (eski va yangi key birga):');
			stats.conflicts.slice(0, 20).forEach((c) => console.log('  ' + c));
		}
	} finally {
		await client.close();
	}
};

main().catch((e) => {
	console.error(e.message);
	process.exit(1);
});
