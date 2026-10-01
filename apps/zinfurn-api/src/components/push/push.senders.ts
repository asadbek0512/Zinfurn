import { connect } from 'http2';
import { createPrivateKey, sign } from 'crypto';

export interface PushMessage {
	title: string;
	body: string;
	/** App ichida ochiladigan yo'l, masalan /mypage?category=myOrders */
	url?: string;
}

/** Token endi yaroqsiz (app o'chirilgan) — bazadan o'chirish kerak */
export class InvalidPushTokenError extends Error {}

const FCM_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
/** Google access token 1 soat yashaydi — biroz oldinroq yangilaymiz */
const GOOGLE_TOKEN_TTL_SEC = 3600;
const TOKEN_REFRESH_MARGIN_SEC = 300;
/** APNs provider token 20–60 daqiqa oralig'ida yangilanishi kerak */
const APNS_TOKEN_TTL_SEC = 45 * 60;
const APNS_HOST_PROD = 'https://api.push.apple.com';
const APNS_HOST_DEV = 'https://api.sandbox.push.apple.com';
const APNS_GONE = 410;
const APNS_INVALID_REASONS = ['BadDeviceToken', 'Unregistered', 'DeviceTokenNotForTopic'];
const HTTP_NOT_FOUND = 404;

const base64url = (input: string): string => Buffer.from(input, 'utf8').toString('base64url');
const nowSec = (): number => Math.floor(Date.now() / 1000);

interface ServiceAccount {
	project_id: string;
	client_email: string;
	private_key: string;
}

/** Android: Firebase Cloud Messaging HTTP v1. Env: FIREBASE_SERVICE_ACCOUNT (JSON yoki base64 JSON) */
export class FcmSender {
	private account: ServiceAccount | null = null;
	private accessToken = '';
	private accessTokenExp = 0;

	constructor(raw = process.env.FIREBASE_SERVICE_ACCOUNT) {
		if (!raw) return;
		const json = raw.trim().startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8');
		this.account = JSON.parse(json) as ServiceAccount;
	}

	public get enabled(): boolean {
		return Boolean(this.account);
	}

	public async send(token: string, message: PushMessage): Promise<void> {
		if (!this.account) return;
		const res = await fetch(`https://fcm.googleapis.com/v1/projects/${this.account.project_id}/messages:send`, {
			method: 'POST',
			headers: { Authorization: `Bearer ${await this.getAccessToken()}`, 'Content-Type': 'application/json' },
			body: JSON.stringify({
				message: {
					token,
					notification: { title: message.title, body: message.body },
					data: message.url ? { url: message.url } : {},
					android: { priority: 'HIGH', notification: { sound: 'default', channel_id: 'default' } },
				},
			}),
		});
		if (res.ok) return;
		const text = await res.text();
		if (res.status === HTTP_NOT_FOUND || text.includes('UNREGISTERED')) throw new InvalidPushTokenError(text);
		throw new Error(`FCM ${res.status}: ${text}`);
	}

	private async getAccessToken(): Promise<string> {
		if (this.accessToken && nowSec() < this.accessTokenExp - TOKEN_REFRESH_MARGIN_SEC) return this.accessToken;
		const account = this.account as ServiceAccount;
		const iat = nowSec();
		const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
		const claims = base64url(
			JSON.stringify({ iss: account.client_email, scope: FCM_SCOPE, aud: GOOGLE_TOKEN_URL, iat, exp: iat + GOOGLE_TOKEN_TTL_SEC }),
		);
		const signature = sign('RSA-SHA256', Buffer.from(`${header}.${claims}`), account.private_key).toString('base64url');
		const res = await fetch(GOOGLE_TOKEN_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
				assertion: `${header}.${claims}.${signature}`,
			}),
		});
		if (!res.ok) throw new Error(`Google OAuth ${res.status}: ${await res.text()}`);
		const data = (await res.json()) as { access_token: string; expires_in: number };
		this.accessToken = data.access_token;
		this.accessTokenExp = iat + data.expires_in;
		return this.accessToken;
	}
}

/** iOS: Apple Push Notification service (token-based .p8). Env: APNS_KEY_ID, APNS_TEAM_ID, APNS_KEY, APNS_BUNDLE_ID, APNS_SANDBOX */
export class ApnsSender {
	private readonly keyId = process.env.APNS_KEY_ID;
	private readonly teamId = process.env.APNS_TEAM_ID;
	private readonly key = process.env.APNS_KEY?.replace(/\\n/g, '\n');
	private readonly topic = process.env.APNS_BUNDLE_ID || 'uz.zinfurn.app';
	private readonly host = process.env.APNS_SANDBOX === 'true' ? APNS_HOST_DEV : APNS_HOST_PROD;
	private jwt = '';
	private jwtIat = 0;

	public get enabled(): boolean {
		return Boolean(this.keyId && this.teamId && this.key);
	}

	public send(token: string, message: PushMessage): Promise<void> {
		if (!this.enabled) return Promise.resolve();
		const payload = JSON.stringify({
			aps: { alert: { title: message.title, body: message.body }, sound: 'default' },
			...(message.url ? { url: message.url } : {}),
		});
		return new Promise((resolve, reject) => {
			const client = connect(this.host);
			client.on('error', reject);
			const req = client.request({
				':method': 'POST',
				':path': `/3/device/${token}`,
				authorization: `bearer ${this.getJwt()}`,
				'apns-topic': this.topic,
				'apns-push-type': 'alert',
				'content-type': 'application/json',
			});
			let status = 0;
			let body = '';
			req.on('response', (headers) => (status = Number(headers[':status'])));
			req.on('data', (chunk) => (body += chunk));
			req.on('end', () => {
				client.close();
				if (status === 200) return resolve();
				if (status === APNS_GONE || APNS_INVALID_REASONS.some((r) => body.includes(r))) return reject(new InvalidPushTokenError(body));
				reject(new Error(`APNs ${status}: ${body}`));
			});
			req.on('error', (err) => {
				client.close();
				reject(err);
			});
			req.end(payload);
		});
	}

	private getJwt(): string {
		if (this.jwt && nowSec() - this.jwtIat < APNS_TOKEN_TTL_SEC) return this.jwt;
		this.jwtIat = nowSec();
		const header = base64url(JSON.stringify({ alg: 'ES256', kid: this.keyId }));
		const claims = base64url(JSON.stringify({ iss: this.teamId, iat: this.jwtIat }));
		const signature = sign('sha256', Buffer.from(`${header}.${claims}`), {
			key: createPrivateKey(this.key as string),
			dsaEncoding: 'ieee-p1363',
		}).toString('base64url');
		this.jwt = `${header}.${claims}.${signature}`;
		return this.jwt;
	}
}
