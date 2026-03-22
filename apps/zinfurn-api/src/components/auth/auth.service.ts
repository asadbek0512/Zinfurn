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
		const payload: T = {};
		Object.keys(member['_doc'] ? member['_doc'] : member).map((ele) => {
			payload[`${ele}`] = member[`${ele}`];
		});
		delete payload.memberPassword;
		return await this.jwtService.signAsync(payload);
	}

	public async verifyToken(token: string): Promise<Member> {
		const member = await this.jwtService.verifyAsync(token);
		member._id = ShapeIntoMongoObjectId(member._id);
		return member;
	}

	public async googleLogin(googleUser: any): Promise<{ token: string }> {
		const { email, firstName, lastName, picture, sub } = googleUser;

		// 1. Google ID bilan qidir
		let member = await this.memberModel.findOne({ memberGoogleId: sub }).exec();

		if (member) {
			const token = await this.createToken(member);
			return { token };
		}

		// 2. Email bilan qidir
		member = await this.memberModel.findOne({ memberEmail: email }).exec();

		if (member) {
			member = await this.memberModel
				.findOneAndUpdate({ _id: member._id }, { memberGoogleId: sub }, { new: true })
				.exec();
			const token = await this.createToken(member!);
			return { token };
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

		const token = await this.createToken(member);
		return { token };
	}

	public async telegramLogin(telegramUser: any): Promise<{ token: string }> {
		const { id, first_name, last_name, username, photo_url } = telegramUser;

		// DB da shu telegram id bilan user bormi tekshiramiz
		let member = await this.memberModel.findOne({ memberTelegramId: String(id) }).exec();

		if (!member) {
			// Yangi Telegram user yaratamiz
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

		const token = await this.createToken(member);
		return { token };
	}

	// Mavjud akkauntga Telegram bog'lash
	public async linkTelegram(memberId: string, telegramUser: any): Promise<{ token: string }> {
		const { id, first_name, last_name, username, photo_url } = telegramUser;

		// Bu Telegram ID boshqa akkauntda bog'liq emasmi tekshiramiz
		const existing = await this.memberModel.findOne({ memberTelegramId: String(id) }).exec();
		if (existing) throw new Error('This Telegram account is already linked to another account!');

		const member = await this.memberModel
			.findOneAndUpdate({ _id: memberId }, { memberTelegramId: String(id) }, { new: true })
			.exec();

		const token = await this.createToken(member!);
		return { token };
	}

	// Mavjud akkauntga Google bog'lash
	public async linkGoogle(memberId: string, googleUser: any): Promise<{ token: string }> {
		const { email, sub } = googleUser;

		// 1. Bu Google ID allaqachon bog'langanmi tekshiramiz
		const existingGoogle = await this.memberModel.findOne({ memberGoogleId: sub }).exec();

		if (existingGoogle) {
			// Agar bu Google ID shu userga bog'langan bo'lsa, hech narsa qilmaslik
			if (existingGoogle._id.toString() === memberId) {
				const token = await this.createToken(existingGoogle);
				return { token };
			}
			// Agar boshqa userga bog'langan bo'lsa, xato
			throw new Error('This Google account is already linked to another account!');
		}

		// 2. Hozirgi userni topamiz
		const member = await this.memberModel.findOne({ _id: memberId }).exec();
		if (!member) {
			throw new Error('Member not found!');
		}

		// 3. Agar hozirgi userda email bo'lsa va u boshqa userga tegishli bo'lsa, tekshiramiz
		if (member.memberEmail && member.memberEmail !== email) {
			const existingEmail = await this.memberModel.findOne({
				memberEmail: email,
				_id: { $ne: memberId }
			}).exec();

			if (existingEmail) {
				// Email boshqa userda, lekin Google ID yo'q - birlashtiramiz
				if (!existingEmail.memberGoogleId) {
					// Google ID ni shu userga o'tkazamiz
					await this.memberModel.updateOne(
						{ _id: existingEmail._id },
						{ $set: { memberGoogleId: sub } }
					);
					const token = await this.createToken(existingEmail);
					return { token };
				}
				// Email boshqa userda va Google ID ham bor - xato
				throw new Error('This email is already associated with another account!');
			}
		}

		// 4. Google ID ni bog'laymiz (email bo'lsa ham, bo'lmasa ham)
		const updateData: any = { memberGoogleId: sub };
		
		// Email ni faqat shu holda yangilaymiz: agar userda email bo'lmasa yoki google email bilan bir xil bo'lsa
		if (!member.memberEmail || member.memberEmail === email) {
			updateData.memberEmail = email;
		}
		
		if (member.memberPhone === '') {
			updateData.memberPhone = null;
		}

		const updatedMember = await this.memberModel
			.findOneAndUpdate({ _id: memberId }, updateData, { new: true })
			.exec();

		if (!updatedMember) {
			throw new Error('Failed to update member!');
		}

		const token = await this.createToken(updatedMember);
		return { token };
	}
}
