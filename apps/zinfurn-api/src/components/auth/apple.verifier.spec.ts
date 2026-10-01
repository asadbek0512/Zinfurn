import { generateKeyPairSync, createSign } from 'crypto';
import { UnauthorizedException } from '@nestjs/common';
import { AppleVerifier } from './apple.verifier';

const KID = 'test-kid';
const BUNDLE_ID = 'uz.zinfurn.app';
const HOUR_SEC = 3600;

const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const other = generateKeyPairSync('rsa', { modulusLength: 2048 });

const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString('base64url');
const sign = (payload: object, key = privateKey) => {
	const head = `${b64({ alg: 'RS256', kid: KID })}.${b64(payload)}`;
	return `${head}.${createSign('RSA-SHA256').update(head).sign(key).toString('base64url')}`;
};
const now = () => Math.floor(Date.now() / 1000);
const validPayload = () => ({ iss: 'https://appleid.apple.com', aud: BUNDLE_ID, exp: now() + HOUR_SEC, sub: '001.abc', email: 'a@privaterelay.appleid.com' });

describe('AppleVerifier', () => {
	beforeEach(() => {
		global.fetch = jest.fn(async () => ({
			ok: true,
			json: async () => ({ keys: [{ ...publicKey.export({ format: 'jwk' }), kid: KID }] }),
		})) as unknown as typeof fetch;
	});

	it("to'g'ri imzolangan token'dan sub va email qaytadi", async () => {
		await expect(new AppleVerifier().verify(sign(validPayload()))).resolves.toEqual({ sub: '001.abc', email: 'a@privaterelay.appleid.com' });
	});

	it('boshqa kalit bilan imzolangan, boshqa audience yoki muddati o\'tgan token rad etiladi', async () => {
		const v = new AppleVerifier();
		await expect(v.verify(sign(validPayload(), other.privateKey))).rejects.toBeInstanceOf(UnauthorizedException);
		await expect(v.verify(sign({ ...validPayload(), aud: 'com.evil.app' }))).rejects.toBeInstanceOf(UnauthorizedException);
		await expect(v.verify(sign({ ...validPayload(), exp: now() - HOUR_SEC }))).rejects.toBeInstanceOf(UnauthorizedException);
		await expect(v.verify('garbage')).rejects.toBeInstanceOf(UnauthorizedException);
	});
});
