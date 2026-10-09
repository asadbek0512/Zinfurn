import { createHash } from 'crypto';
import { Model } from 'mongoose';
import { OrderStatus } from '../../libs/enums/order.enum';
import { PaymentMethod, PaymentStatus } from '../../libs/enums/payment.enum';
import { OrderService } from './order.service';
import { PaymeService } from './payme.service';
import { ClickService } from './click.service';

/**
 * Payme Merchant API va Click Shop API oqimlari — provayder sandbox'idagi asosiy holatlar:
 *  - auth / imzo noto'g'ri bo'lsa rad etiladi
 *  - summa tiyin/so'mda tekshiriladi
 *  - to'liq oqim buyurtmani PAID qiladi, takroriy chaqiruv idempotent
 */

type Doc = Record<string, unknown>;

const getPath = (doc: Doc, path: string): unknown =>
	path.split('.').reduce<unknown>((value, key) => (value as Doc | undefined)?.[key], doc);

const matches = (doc: Doc, filter: Doc): boolean =>
	Object.entries(filter).every(([key, cond]) => {
		const value = getPath(doc, key);
		if (cond && typeof cond === 'object' && !Array.isArray(cond)) {
			const op = cond as { $ne?: unknown; $in?: unknown[]; $gte?: number; $lte?: number };
			if ('$ne' in op) return value !== op.$ne;
			if (op.$in) return op.$in.includes(value);
			if (op.$gte !== undefined) return (value as number) >= op.$gte && (value as number) <= (op.$lte ?? Infinity);
		}
		return value === cond;
	});

const applyUpdate = (doc: Doc, update: Doc): void => {
	Object.entries(update).forEach(([path, value]) => {
		const keys = path.split('.');
		const last = keys.pop() as string;
		const target = keys.reduce<Doc>((obj, key) => (obj[key] ??= {}) as Doc, doc);
		target[last] = value && typeof value === 'object' ? { ...(value as Doc) } : value;
	});
};

/** Faqat servislar ishlatadigan Mongoose chaqiruvlarining xotiradagi o'xshashi */
const makeOrderModel = (docs: Doc[]) => {
	const chain = <T>(result: () => T) => ({
		lean: () => ({ exec: async () => result() }),
		exec: async () => result(),
		sort: () => ({ limit: () => ({ lean: () => ({ exec: async () => result() }) }) }),
	});
	const clone = (doc: Doc | undefined) => (doc ? structuredClone(doc) : null);
	return {
		findOne: (filter: Doc) => chain(() => clone(docs.find((d) => matches(d, filter)))),
		find: (filter: Doc) => chain(() => docs.filter((d) => matches(d, filter)).map((d) => clone(d))),
		findOneAndUpdate: (filter: Doc, update: Doc) =>
			chain(() => {
				const doc = docs.find((d) => matches(d, filter));
				if (!doc) return null;
				applyUpdate(doc, update);
				return clone(doc);
			}),
		updateOne: (filter: Doc, update: Doc) =>
			chain(() => {
				const doc = docs.find((d) => matches(d, filter));
				if (doc) applyUpdate(doc, update);
				return { modifiedCount: doc ? 1 : 0 };
			}),
	} as unknown as Model<never>;
};

const AMOUNT_SUM = 127000;

const makeOrder = (paymentMethod: PaymentMethod): Doc => ({
	_id: 'db1',
	orderId: 'ZIN-1',
	paymentMethod,
	paymentStatus: PaymentStatus.UNPAID,
	orderStatus: OrderStatus.PENDING,
	paymentAmount: AMOUNT_SUM,
});

/** markPaid / cancelUnpaidOrder'ni xotiradagi hujjatga qo'llaydigan OrderService o'rnini bosuvchi */
const makeOrderService = (doc: Doc) =>
	({
		markPaid: jest.fn(async (_id: unknown, paymentKey: string) => {
			if (doc.paymentStatus !== PaymentStatus.UNPAID) return null;
			Object.assign(doc, { paymentStatus: PaymentStatus.PAID, paymentKey });
			return doc;
		}),
		cancelUnpaidOrder: jest.fn(async () => {
			if (doc.paymentStatus === PaymentStatus.UNPAID) doc.orderStatus = OrderStatus.CANCELLED;
		}),
	}) as unknown as OrderService & { markPaid: jest.Mock; cancelUnpaidOrder: jest.Mock };

describe('PaymeService', () => {
	const KEY = 'test-key';
	const AUTH = `Basic ${Buffer.from(`Paycom:${KEY}`).toString('base64')}`;
	const TIYIN = AMOUNT_SUM * 100;

	beforeEach(() => {
		process.env.PAYME_KEY = KEY;
	});
	afterEach(() => {
		delete process.env.PAYME_KEY;
	});

	const setup = () => {
		const doc = makeOrder(PaymentMethod.PAYME);
		const orderService = makeOrderService(doc);
		const service = new PaymeService(makeOrderModel([doc]), orderService);
		const call = (method: string, params: Doc, auth = AUTH) => service.handle({ id: 1, method, params }, auth);
		return { doc, orderService, call };
	};

	it("noto'g'ri kalit — -32504", async () => {
		const { call } = setup();
		const res = await call('CheckPerformTransaction', { amount: TIYIN, account: { order_id: 'ZIN-1' } }, 'Basic d3Jvbmc=');
		expect(res.error?.code).toBe(-32504);
	});

	it("summa mos kelmasa — -31001, buyurtma topilmasa — -31050", async () => {
		const { call } = setup();
		expect((await call('CheckPerformTransaction', { amount: 1, account: { order_id: 'ZIN-1' } })).error?.code).toBe(-31001);
		expect((await call('CheckPerformTransaction', { amount: TIYIN, account: { order_id: 'X' } })).error?.code).toBe(-31050);
	});

	it("to'liq oqim: Check → Create → Perform → buyurtma PAID, takroriy Perform idempotent", async () => {
		const { doc, orderService, call } = setup();
		expect((await call('CheckPerformTransaction', { amount: TIYIN, account: { order_id: 'ZIN-1' } })).result).toEqual({ allow: true });

		const create = await call('CreateTransaction', { id: 'tx1', time: Date.now(), amount: TIYIN, account: { order_id: 'ZIN-1' } });
		expect(create.result).toMatchObject({ state: 1, transaction: 'db1' });
		// Boshqa tranzaksiya shu buyurtmaga — band
		const other = await call('CreateTransaction', { id: 'tx2', time: Date.now(), amount: TIYIN, account: { order_id: 'ZIN-1' } });
		expect(other.error?.code).toBe(-31051);

		const perform = await call('PerformTransaction', { id: 'tx1' });
		expect(perform.result).toMatchObject({ state: 2 });
		expect(doc.paymentStatus).toBe(PaymentStatus.PAID);
		expect((await call('PerformTransaction', { id: 'tx1' })).result).toMatchObject({ state: 2 });
		expect(orderService.markPaid).toHaveBeenCalledTimes(1);

		expect((await call('CheckTransaction', { id: 'tx1' })).result).toMatchObject({ state: 2, reason: null });
	});

	it("bajarilgan tranzaksiya bekor qilinsa — state -2, buyurtma CANCELLED", async () => {
		const { doc, call } = setup();
		await call('CreateTransaction', { id: 'tx1', time: Date.now(), amount: TIYIN, account: { order_id: 'ZIN-1' } });
		await call('PerformTransaction', { id: 'tx1' });
		const cancel = await call('CancelTransaction', { id: 'tx1', reason: 5 });
		expect(cancel.result).toMatchObject({ state: -2 });
		expect(doc.orderStatus).toBe(OrderStatus.CANCELLED);
		expect((await call('CheckTransaction', { id: 'tx1' })).result).toMatchObject({ state: -2, reason: 5 });
	});

	it("yaratilgan tranzaksiya bekor qilinsa — state -1, Perform endi -31008", async () => {
		const { orderService, call } = setup();
		await call('CreateTransaction', { id: 'tx1', time: Date.now(), amount: TIYIN, account: { order_id: 'ZIN-1' } });
		expect((await call('CancelTransaction', { id: 'tx1', reason: 3 })).result).toMatchObject({ state: -1 });
		expect(orderService.cancelUnpaidOrder).toHaveBeenCalled();
		expect((await call('PerformTransaction', { id: 'tx1' })).error?.code).toBe(-31008);
	});

	it("noma'lum tranzaksiya — -31003, noma'lum metod — -32601", async () => {
		const { call } = setup();
		expect((await call('CheckTransaction', { id: 'nope' })).error?.code).toBe(-31003);
		expect((await call('Unknown', {})).error?.code).toBe(-32601);
	});
});

describe('ClickService', () => {
	const SECRET = 'click-secret';
	const SERVICE_ID = '777';

	beforeEach(() => {
		process.env.CLICK_SECRET_KEY = SECRET;
		process.env.CLICK_SERVICE_ID = SERVICE_ID;
	});
	afterEach(() => {
		delete process.env.CLICK_SECRET_KEY;
		delete process.env.CLICK_SERVICE_ID;
	});

	const sign = (p: Doc, prepareId = '') =>
		createHash('md5')
			.update(`${p.click_trans_id}${SERVICE_ID}${SECRET}${p.merchant_trans_id}${prepareId}${p.amount}${p.action}${p.sign_time}`)
			.digest('hex');

	const setup = () => {
		const doc = makeOrder(PaymentMethod.CLICK);
		const orderService = makeOrderService(doc);
		const service = new ClickService(makeOrderModel([doc]), orderService);
		const base = { click_trans_id: '555', service_id: SERVICE_ID, merchant_trans_id: 'ZIN-1', amount: `${AMOUNT_SUM}.00`, sign_time: '2026-10-09 10:00:00' };
		return { doc, service, base };
	};

	it("imzo noto'g'ri — -1", async () => {
		const { service, base } = setup();
		const res = await service.prepare({ ...base, action: '0', sign_string: 'bad' });
		expect(res.error).toBe(-1);
	});

	it("to'liq oqim: prepare → complete → PAID, takroriy complete — -4", async () => {
		const { doc, service, base } = setup();
		const prep = { ...base, action: '0' };
		const prepared = await service.prepare({ ...prep, sign_string: sign(prep) });
		expect(prepared.error).toBe(0);
		const prepareId = String(prepared.merchant_prepare_id);

		const comp = { ...base, action: '1', merchant_prepare_id: prepareId, error: '0' };
		const completed = await service.complete({ ...comp, sign_string: sign(comp, prepareId) });
		expect(completed).toMatchObject({ error: 0, merchant_confirm_id: Number(prepareId) });
		expect(doc.paymentStatus).toBe(PaymentStatus.PAID);

		const again = await service.complete({ ...comp, sign_string: sign(comp, prepareId) });
		expect(again.error).toBe(-4);
	});

	it("summa mos kelmasa — -2; Click xato yuborsa buyurtma bekor — -9", async () => {
		const { doc, service, base } = setup();
		const wrong = { ...base, amount: '1.00', action: '0' };
		expect((await service.prepare({ ...wrong, sign_string: sign(wrong) })).error).toBe(-2);

		const prep = { ...base, action: '0' };
		const prepareId = String((await service.prepare({ ...prep, sign_string: sign(prep) })).merchant_prepare_id);
		const failed = { ...base, action: '1', merchant_prepare_id: prepareId, error: '-5017' };
		expect((await service.complete({ ...failed, sign_string: sign(failed, prepareId) })).error).toBe(-9);
		expect(doc.orderStatus).toBe(OrderStatus.CANCELLED);
	});
});
