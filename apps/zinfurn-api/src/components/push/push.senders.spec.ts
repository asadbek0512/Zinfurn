import { generateKeyPairSync, verify } from 'crypto';
import { ApnsSender, FcmSender } from './push.senders';

describe('push senders', () => {
	it('env bo\'lmasa o\'chiq', () => {
		expect(new FcmSender('').enabled).toBe(false);
		expect(new ApnsSender().enabled).toBe(false);
	});

	it('APNs JWT ES256 bilan to\'g\'ri imzolanadi', () => {
		const { privateKey, publicKey } = generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
		process.env.APNS_KEY_ID = 'KEY123';
		process.env.APNS_TEAM_ID = 'TEAM123';
		process.env.APNS_KEY = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString().replace(/\n/g, '\\n');
		const sender = new ApnsSender();
		const jwt = (sender as unknown as { getJwt: () => string }).getJwt();
		const [header, claims, signature] = jwt.split('.');
		expect(JSON.parse(Buffer.from(header, 'base64url').toString())).toEqual({ alg: 'ES256', kid: 'KEY123' });
		expect(JSON.parse(Buffer.from(claims, 'base64url').toString()).iss).toBe('TEAM123');
		const ok = verify('sha256', Buffer.from(`${header}.${claims}`), { key: publicKey, dsaEncoding: 'ieee-p1363' }, Buffer.from(signature, 'base64url'));
		expect(ok).toBe(true);
	});
});
