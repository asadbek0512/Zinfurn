import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { createPublicKey, createVerify, JsonWebKey } from 'crypto';

const APPLE_ISSUER = 'https://appleid.apple.com';
const APPLE_KEYS_URL = `${APPLE_ISSUER}/auth/keys`;
const KEYS_CACHE_MS = 60 * 60 * 1000;
const DEFAULT_CLIENT_IDS = 'uz.zinfurn.app';

interface AppleJwk extends JsonWebKey {
	kid: string;
}

export interface AppleIdentity {
	sub: string;
	email?: string;
}

interface AppleTokenPayload {
	iss: string;
	aud: string;
	exp: number;
	sub: string;
	email?: string;
}

const decodePart = <R>(part: string): R => JSON.parse(Buffer.from(part, 'base64url').toString('utf8')) as R;

/**
 * "Sign in with Apple" identity token (JWT, RS256) ni Apple public key'lari bilan tekshiradi.
 * Native iOS oqimida token audience'i — app bundle ID, shuning uchun secret kerak emas.
 */
@Injectable()
export class AppleVerifier {
	private readonly logger = new Logger(AppleVerifier.name);
	private keys: AppleJwk[] = [];
	private keysFetchedAt = 0;

	private get clientIds(): string[] {
		return (process.env.APPLE_CLIENT_IDS || DEFAULT_CLIENT_IDS).split(',').map((id) => id.trim());
	}

	private async getKey(kid: string): Promise<AppleJwk | undefined> {
		const stale = Date.now() - this.keysFetchedAt > KEYS_CACHE_MS;
		// Apple kalitlarni almashtirsa — noma'lum kid kelganda keshni yangilaymiz
		if (stale || !this.keys.some((k) => k.kid === kid)) {
			const res = await fetch(APPLE_KEYS_URL);
			if (!res.ok) throw new UnauthorizedException('Apple keys unavailable');
			this.keys = ((await res.json()) as { keys: AppleJwk[] }).keys;
			this.keysFetchedAt = Date.now();
		}
		return this.keys.find((k) => k.kid === kid);
	}

	public async verify(identityToken: string): Promise<AppleIdentity> {
		const parts = identityToken?.split('.');
		if (parts?.length !== 3) throw new UnauthorizedException('Invalid Apple token');
		const [headerPart, payloadPart, signature] = parts;

		const header = decodePart<{ kid: string; alg: string }>(headerPart);
		if (header.alg !== 'RS256') throw new UnauthorizedException('Invalid Apple token');
		const jwk = await this.getKey(header.kid);
		if (!jwk) throw new UnauthorizedException('Invalid Apple token');

		const valid = createVerify('RSA-SHA256')
			.update(`${headerPart}.${payloadPart}`)
			.verify(createPublicKey({ key: jwk, format: 'jwk' }), Buffer.from(signature, 'base64url'));
		if (!valid) throw new UnauthorizedException('Invalid Apple token');

		const payload = decodePart<AppleTokenPayload>(payloadPart);
		if (payload.iss !== APPLE_ISSUER || !this.clientIds.includes(payload.aud)) {
			this.logger.warn(`Apple token rejected: iss=${payload.iss} aud=${payload.aud}`);
			throw new UnauthorizedException('Invalid Apple token');
		}
		if (payload.exp * 1000 < Date.now()) throw new UnauthorizedException('Apple token expired');

		return { sub: payload.sub, email: payload.email };
	}
}
