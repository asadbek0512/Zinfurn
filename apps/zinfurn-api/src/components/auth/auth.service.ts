import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Member } from '../../libs/dto/member/member';
import { T } from '../../libs/types/common';
import { ShapeIntoMongoObjectId } from '../../libs/config';
import { MemberAuthType, MemberStatus, MemberType } from '../../libs/enums/member.enum';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		@InjectModel('Member') private readonly memberModel: Model<Member>,
	) {}

	public async hashPassword(memberPassword: string): Promise<string> {
		const salt = await bcrypt.genSalt();
		return await bcrypt.hash(memberPassword, salt);
	}

	public async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
		return await bcrypt.compare(password, hashedPassword);
	}

	public async createToken(member: Member): Promise<string> {
		const doc = member['_doc'] ? member['_doc'] : member;
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
		return await this.jwtService.signAsync(payload, { expiresIn: process.env.ACCESS_TOKEN_TTL || '1h' });
	}

	/** Refresh token — minimal payload, 30 kun. Access sifatida ishlatib BO'LMAYDI (verifyToken rad etadi). */
	public async createRefreshToken(member: Member): Promise<string> {
		const doc = member['_doc'] ? member['_doc'] : member;
		return await this.jwtService.signAsync(
			{ _id: doc._id, tokenType: 'refresh' },
			{ expiresIn: process.env.REFRESH_TOKEN_TTL || '30d' },
		);
	}

	/** Access + refresh juftligi — login/signup/OAuth/linking hammasi shu orqali. */
	public async createTokenPair(member: Member): Promise<{ token: string; refresh: string }> {
		const token = await this.createToken(member);
		const refresh = await this.createRefreshToken(member);
		return { token, refresh };
	}

	public async verifyToken(token: string): Promise<Member> {
		const member = await this.jwtService.verifyAsync(token);
		// Refresh token access o'rnida ishlatilmasin
		if (member?.tokenType === 'refresh') throw new Error('Refresh token cannot be used for authentication');
		member._id = ShapeIntoMongoObjectId(member._id);
		return member;
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

		const member = await this.memberModel.findById(ShapeIntoMongoObjectId(payload._id)).exec();
		if (!member || member.memberStatus !== MemberStatus.ACTIVE) throw new Error('Member is not active');

		const pair = await this.createTokenPair(member);
		return { member, ...pair };
	}

	public async googleLogin(googleUser: any): Promise<{ token: string; refresh: string }> {
		const { email, firstName, lastName, picture, sub } = googleUser;

		// 1. Google ID bilan qidir
		let member = await this.memberModel.findOne({ memberGoogleId: sub }).exec();
		if (member) {
			return await this.createTokenPair(member);
		}

		// 2. Email bilan qidir — Telegram bilan kirgan user bo'lishi mumkin
		member = await this.memberModel.findOne({ memberEmail: email }).exec();
		if (member) {
			if (!member.memberGoogleId) {
				member = await this.memberModel
					.findOneAndUpdate({ _id: member._id }, { memberGoogleId: sub }, { new: true })
					.exec();
			}
			return await this.createTokenPair(member!);
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

		return await this.createTokenPair(member);
	}

	public async telegramLogin(telegramUser: any): Promise<{ token: string; refresh: string }> {
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

		return await this.createTokenPair(member);
	}

	public async linkTelegram(memberId: string, telegramUser: any): Promise<{ token: string; refresh: string }> {
		const { id } = telegramUser;

		const existing = await this.memberModel.findOne({ memberTelegramId: String(id) }).exec();
		if (existing) throw new Error('This Telegram account is already linked to another account!');

		const member = await this.memberModel
			.findOneAndUpdate({ _id: memberId }, { memberTelegramId: String(id) }, { new: true })
			.exec();

		return await this.createTokenPair(member!);
	}

	public async linkGoogle(memberId: string, googleUser: any): Promise<{ token: string; refresh: string }> {
		const { email, sub } = googleUser;

		// 1. Bu Google ID allaqachon bog'langanmi
		const existingGoogle = await this.memberModel.findOne({ memberGoogleId: sub }).exec();
		if (existingGoogle) {
			if (existingGoogle._id.toString() === memberId) {
				return await this.createTokenPair(existingGoogle);
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

		return await this.createTokenPair(updatedMember);
	}
}
