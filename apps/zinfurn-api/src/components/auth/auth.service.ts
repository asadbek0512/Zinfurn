import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { Member } from '../../libs/dto/member/member';
import { T } from '../../libs/types/common';
import { ShapeIntoMongoObjectId } from '../../libs/config';
import { MemberAuthType, MemberStatus, MemberType } from '../../libs/enums/member.enum';
import { AppleIdentity } from './apple.verifier';

const APPLE_NICK_PREFIX = 'apple_';
const APPLE_NICK_ID_LENGTH = 6;

/** Web sessiyaning MUTLAQ umri — login paytidan boshlab. Refresh rotation buni uzaytira olmaydi. */
const SESSION_MAX_AGE_SEC = Number(process.env.SESSION_MAX_AGE_SEC) || 10 * 60 * 60; // 10 soat
/** Access token umri — sessiya qoldig'idan oshmaydi. */
const ACCESS_TOKEN_TTL_SEC = Number(process.env.ACCESS_TOKEN_TTL_SEC) || 60 * 60; // 1 soat
/** App sessiyasi sirpanuvchi: har refresh'da shuncha muddatga uzayadi (ishlatilmasa tugaydi). */
const APP_SESSION_IDLE_SEC = Number(process.env.APP_SESSION_IDLE_SEC) || 30 * 24 * 60 * 60; // 30 kun
/** App sessiyasining mutlaq chegarasi — faol ishlatilsa ham shundan keyin qayta login. */
const APP_SESSION_MAX_AGE_SEC = Number(process.env.APP_SESSION_MAX_AGE_SEC) || 90 * 24 * 60 * 60; // 90 kun
/** Bitta member uchun saqlanadigan sessiyalar (web + app qurilmalar) soni. */
const MAX_SESSIONS = 20;
// Akkaunt ulash (Telegram/Google) uchun qisqa muddatli token — tashqi oauth oqimida memberId o'rniga yuriladi
const LINK_TOKEN_TTL_SEC = 10 * 60;
const LINK_TOKEN_TYPE = 'link';
/** Rotation javobi yetib bormasa (tarmoq/parallel so'rov) — oldingi refresh shuncha vaqt qabul qilinadi. */
const REFRESH_REUSE_GRACE_SEC = 60;
/** Capacitor app WebView User-Agent'iga qo'shadigan belgi (zinfurn-app/capacitor.config.ts). */
const APP_UA_TAG = 'ZinfurnApp/';

export type SessionClient = 'web' | 'app';

const nowSec = (): number => Math.floor(Date.now() / 1000);

/** So'rov mobil app'dan kelganmi — WebView User-Agent orqali. */
export const clientFromRequest = (req: any): SessionClient =>
	String(req?.headers?.['user-agent'] ?? '').includes(APP_UA_TAG) ? 'app' : 'web';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		@InjectModel('Member') private readonly memberModel: Model<Member>,
	) {}

	/** Mutlaq chegara: web — login + 10 soat, app — login + 90 kun. */
	private sessionHardLimit(sessionStartedAt: number, client: SessionClient): number {
		return sessionStartedAt + (client === 'app' ? APP_SESSION_MAX_AGE_SEC : SESSION_MAX_AGE_SEC);
	}

	/**
	 * Sessiya tugashiga qolgan sekundlar. 0 yoki manfiy — sessiya o'lgan.
	 * App uchun hozirdan 30 kun (idle), lekin mutlaq chegaradan oshmaydi.
	 */
	private sessionRemaining(sessionStartedAt: number, client: SessionClient = 'web'): number {
		const hardLeft = this.sessionHardLimit(sessionStartedAt, client) - nowSec();
		return client === 'app' ? Math.min(APP_SESSION_IDLE_SEC, hardLeft) : hardLeft;
	}

	public async hashPassword(memberPassword: string): Promise<string> {
		const salt = await bcrypt.genSalt();
		return await bcrypt.hash(memberPassword, salt);
	}

	public async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
		return await bcrypt.compare(password, hashedPassword);
	}

	/**
	 * Access token. `sessionStartedAt` berilmasa — yangi sessiya boshlanadi.
	 * Muddati sessiya qoldig'idan oshmaydi: sessiya tugagach access ham darrov o'ladi.
	 */
	public async createToken(member: Member, sessionStartedAt?: number, client: SessionClient = 'web'): Promise<string> {
		const doc = member['_doc'] ? member['_doc'] : member;
		const sid = sessionStartedAt ?? nowSec();
		const remaining = this.sessionRemaining(sid, client);
		if (remaining <= 0) throw new Error('Session expired');

		const payload: T = {
			_id: doc._id,
			memberType: doc.memberType,
			memberStatus: doc.memberStatus,
			memberAuthType: doc.memberAuthType,
			memberNick: doc.memberNick,
			memberFullName: doc.memberFullName,
			memberImage: doc.memberImage,
			memberRank: doc.memberRank,
			memberPoints: doc.memberPoints,
			memberProperties: doc.memberProperties,
			memberArticles: doc.memberArticles,
			memberFollowers: doc.memberFollowers,
			memberFollowings: doc.memberFollowings,
			memberLikes: doc.memberLikes,
			memberViews: doc.memberViews,
			memberWarnings: doc.memberWarnings,
			memberBlocks: doc.memberBlocks,
		};
		payload.tokenType = 'access';
		payload.sid = sid;
		payload.client = client;
		payload.sessionExpiresAt = nowSec() + remaining;

		return await this.jwtService.signAsync(payload, {
			expiresIn: Math.min(ACCESS_TOKEN_TTL_SEC, remaining),
		});
	}

	/**
	 * Refresh token — minimal payload. Access sifatida ishlatib BO'LMAYDI (verifyToken rad etadi).
	 * Web: muddati sessiya qoldig'iga teng (rotation uzaytira olmaydi).
	 * App: har rotation'da 30 kunga uzayadi.
	 * Ikkalasida ham `jti` bazadagi sessiya bilan solishtiriladi (bir martalik, logout'da bekor bo'ladi).
	 */
	public async createRefreshToken(
		member: Member,
		sessionStartedAt?: number,
		client: SessionClient = 'web',
		jti?: string,
	): Promise<string> {
		const doc = member['_doc'] ? member['_doc'] : member;
		const sid = sessionStartedAt ?? nowSec();
		const remaining = this.sessionRemaining(sid, client);
		if (remaining <= 0) throw new Error('Session expired');

		const payload: T = { _id: doc._id, tokenType: 'refresh', sid, client };
		if (jti) payload.jti = jti;
		return await this.jwtService.signAsync(payload, { expiresIn: remaining });
	}

	/**
	 * Access + refresh juftligi — login/signup/OAuth/linking hammasi shu orqali.
	 * `sessionStartedAt` berilsa mavjud sessiya davom etadi, aks holda yangisi boshlanadi.
	 * Sessiya bazaga (memberSessions) yoziladi — joriy refresh `jti` si bilan (web va app).
	 * `prevJti` — rotation'da almashtirilgan token (qisqa grace uchun saqlanadi).
	 */
	public async createTokenPair(
		member: Member,
		sessionStartedAt?: number,
		client: SessionClient = 'web',
		prevJti?: string,
	): Promise<{ token: string; refresh: string }> {
		const sid = sessionStartedAt ?? nowSec();
		const token = await this.createToken(member, sid, client);
		const doc = member['_doc'] ? member['_doc'] : member;
		const jti = randomUUID();
		const expiresAt = new Date((nowSec() + this.sessionRemaining(sid, client)) * 1000);
		// Shu sessiyaning eski yozuvi va muddati o'tganlar tozalanadi, keyin joriy jti yoziladi
		await this.memberModel
			.updateOne({ _id: doc._id }, { $pull: { memberSessions: { $or: [{ sid }, { expiresAt: { $lt: new Date() } }] } } } as T)
			.exec();
		await this.memberModel
			.updateOne(
				{ _id: doc._id },
				{ $push: { memberSessions: { $each: [{ sid, jti, prevJti, rotatedAt: new Date(), expiresAt }], $slice: -MAX_SESSIONS } } } as T,
			)
			.exec();
		const refresh = await this.createRefreshToken(member, sid, client, jti);
		return { token, refresh };
	}

	public async verifyToken(token: string): Promise<Member> {
		const member = await this.jwtService.verifyAsync(token);
		// Refresh token access o'rnida ishlatilmasin
		if (member?.tokenType === 'refresh' || member?.tokenType === LINK_TOKEN_TYPE) {
			throw new Error('Only access tokens can be used for authentication');
		}
		member._id = ShapeIntoMongoObjectId(member._id);
		return member;
	}

	public async createLinkToken(memberId: string): Promise<string> {
		return await this.jwtService.signAsync({ _id: memberId, tokenType: LINK_TOKEN_TYPE }, { expiresIn: LINK_TOKEN_TTL_SEC });
	}

	/** Link token'dan memberId. Boshqa turdagi yoki muddati o'tgan token — xato */
	public async verifyLinkToken(token: unknown): Promise<string> {
		if (typeof token !== 'string' || !token) throw new Error('Link token is missing');
		const payload = await this.jwtService.verifyAsync(token);
		if (payload?.tokenType !== LINK_TOKEN_TYPE || !payload._id) throw new Error('Invalid link token');
		return String(payload._id);
	}

	/** Refresh token evaziga yangi juftlik. Member holati bazadan qayta tekshiriladi (bloklanganlar chetlatiladi). */
	public async refreshTokens(refreshToken: string): Promise<{ member: Member; token: string; refresh: string }> {
		let payload: T;
		try {
			payload = await this.jwtService.verifyAsync(refreshToken);
		} catch {
			throw new Error('Invalid or expired refresh token');
		}
		if (payload?.tokenType !== 'refresh') throw new Error('Invalid refresh token');

		// `sid` rotation'da o'zgarmaydi — mutlaq chegara (web 10 soat, app 90 kun) shundan hisoblanadi.
		const sid: number = typeof payload.sid === 'number' ? payload.sid : 0;
		const client: SessionClient = payload.client === 'app' ? 'app' : 'web';
		if (this.sessionRemaining(sid, client) <= 0) throw new Error('Session expired');

		const memberId = ShapeIntoMongoObjectId(payload._id);
		// jti'siz web refresh — server-side sessiyadan oldingi (legacy) token; 10 soat ichida o'zi tugaydi.
		if (client === 'app' || payload.jti) {
			// Bir martalik: joriy jti (yoki grace ichida oldingisi) qabul qilinadi.
			// Logout/parol almashsa sessiya o'chgan bo'ladi.
			const graceFrom = new Date((nowSec() - REFRESH_REUSE_GRACE_SEC) * 1000);
			const current = await this.memberModel
				.exists({
					_id: memberId,
					memberSessions: {
						$elemMatch: {
							sid,
							$or: [{ jti: payload.jti }, { prevJti: payload.jti, rotatedAt: { $gt: graceFrom } }],
						},
					},
				} as T)
				.exec();
			if (!current) {
				// Eski (allaqachon ishlatilgan) token qayta kelsa — o'g'irlangan bo'lishi mumkin, sessiyani yopamiz
				await this.revokeSession(payload._id, sid);
				throw new Error('Session revoked');
			}
		}

		const member = await this.memberModel.findById(memberId).exec();
		if (!member || member.memberStatus !== MemberStatus.ACTIVE) throw new Error('Member is not active');

		const pair = await this.createTokenPair(member, sid, client, payload.jti);
		return { member, ...pair };
	}

	/** Bitta sessiyani o'chirish (logout). */
	private async revokeSession(memberId: string, sid: number): Promise<void> {
		await this.memberModel
			.updateOne({ _id: ShapeIntoMongoObjectId(memberId) }, { $pull: { memberSessions: { sid } } } as T)
			.exec();
	}

	/** Logout: refresh token egasining shu sessiyasini bekor qiladi (muddati o'tgan token ham qabul). */
	public async logoutSession(refreshToken: string): Promise<void> {
		let payload: T;
		try {
			payload = await this.jwtService.verifyAsync(refreshToken, { ignoreExpiration: true });
		} catch {
			return;
		}
		if (payload?.tokenType !== 'refresh' || typeof payload.sid !== 'number') return;
		await this.revokeSession(payload._id, payload.sid);
	}

	/** Parol almashganda yoki member bloklanganda barcha sessiyalarni bekor qilish. */
	public async revokeAllSessions(memberId: string): Promise<void> {
		await this.memberModel
			.updateOne({ _id: ShapeIntoMongoObjectId(memberId) }, { $set: { memberSessions: [] } } as T)
			.exec();
	}

	public async googleLogin(googleUser: any, client: SessionClient = 'web'): Promise<{ token: string; refresh: string }> {
		const { email, firstName, lastName, picture, sub } = googleUser;

		// 1. Google ID bilan qidir
		let member = await this.memberModel.findOne({ memberGoogleId: sub }).exec();
		if (member) {
			return await this.createTokenPair(member, undefined, client);
		}

		// 2. Email bilan qidir — Telegram bilan kirgan user bo'lishi mumkin
		member = await this.memberModel.findOne({ memberEmail: email }).exec();
		if (member) {
			if (!member.memberGoogleId) {
				member = await this.memberModel
					.findOneAndUpdate({ _id: member._id }, { memberGoogleId: sub }, { new: true })
					.exec();
			}
			return await this.createTokenPair(member!, undefined, client);
		}

		// 3. Yangi user yaratamiz
		member = await this.memberModel.create({
			memberNick: email.split('@')[0] + '_' + Date.now(),
			memberEmail: email,
			memberFullName: `${firstName} ${lastName}`,
			memberImage: picture,
			memberAuthType: MemberAuthType.GOOGLE,
			memberStatus: MemberStatus.ACTIVE,
			memberType: MemberType.USER,
			memberGoogleId: sub,
		});

		return await this.createTokenPair(member, undefined, client);
	}

	public async appleLogin(
		identity: AppleIdentity,
		fullName: string,
		client: SessionClient = 'web',
	): Promise<{ token: string; refresh: string }> {
		let member = await this.memberModel.findOne({ memberAppleId: identity.sub }).exec();
		// Shu email bilan Google orqali kirgan akkaunt bo'lsa — unga bog'laymiz
		if (!member && identity.email) {
			member = await this.memberModel
				.findOneAndUpdate({ memberEmail: identity.email, memberStatus: { $ne: MemberStatus.DELETE } }, { memberAppleId: identity.sub }, { new: true })
				.exec();
		}
		if (!member) {
			member = await this.memberModel.create({
				memberNick: `${APPLE_NICK_PREFIX}${identity.sub.slice(-APPLE_NICK_ID_LENGTH)}_${Date.now()}`,
				memberFullName: fullName,
				memberEmail: identity.email,
				memberAuthType: MemberAuthType.APPLE,
				memberStatus: MemberStatus.ACTIVE,
				memberType: MemberType.USER,
				memberAppleId: identity.sub,
			});
		}
		return await this.createTokenPair(member, undefined, client);
	}

	public async telegramLogin(telegramUser: any, client: SessionClient = 'web'): Promise<{ token: string; refresh: string }> {
		const { id, first_name, last_name, username, photo_url } = telegramUser;

		let member = await this.memberModel.findOne({ memberTelegramId: String(id) }).exec();
		if (!member) {
			member = await this.memberModel.create({
				memberNick: username || `tg_${id}_${Date.now()}`,
				memberFullName: `${first_name} ${last_name || ''}`.trim(),
				memberImage: photo_url || '',
				memberAuthType: MemberAuthType.TELEGRAM,
				memberStatus: MemberStatus.ACTIVE,
				memberType: MemberType.USER,
				memberTelegramId: String(id),
			});
		}

		return await this.createTokenPair(member, undefined, client);
	}

	public async linkTelegram(memberId: string, telegramUser: any, client: SessionClient = 'web'): Promise<{ token: string; refresh: string }> {
		const { id } = telegramUser;

		const existing = await this.memberModel.findOne({ memberTelegramId: String(id) }).exec();
		if (existing) throw new Error('This Telegram account is already linked to another account!');

		const member = await this.memberModel
			.findOneAndUpdate({ _id: memberId }, { memberTelegramId: String(id) }, { new: true })
			.exec();

		return await this.createTokenPair(member!, undefined, client);
	}

	public async linkGoogle(memberId: string, googleUser: any, client: SessionClient = 'web'): Promise<{ token: string; refresh: string }> {
		const { email, sub } = googleUser;

		// 1. Bu Google ID allaqachon bog'langanmi
		const existingGoogle = await this.memberModel.findOne({ memberGoogleId: sub }).exec();
		if (existingGoogle) {
			if (existingGoogle._id.toString() === memberId) {
				return await this.createTokenPair(existingGoogle, undefined, client);
			}
			throw new Error('This Google account is already linked to another account!');
		}

		// 2. Hozirgi userni topamiz
		const member = await this.memberModel.findOne({ _id: memberId }).exec();
		if (!member) throw new Error('Member not found!');

		// 3. Google ID va emailni bog'laymiz
		const updateData: any = { memberGoogleId: sub };
		if (!member.memberEmail) {
			updateData.memberEmail = email;
		}

		const updatedMember = await this.memberModel.findOneAndUpdate({ _id: memberId }, updateData, { new: true }).exec();

		if (!updatedMember) throw new Error('Failed to update member!');

		return await this.createTokenPair(updatedMember, undefined, client);
	}
}
