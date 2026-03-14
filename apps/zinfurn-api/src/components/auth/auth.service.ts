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
		const { email, firstName, lastName, picture } = googleUser;

		// DB da shu email bilan user bormi tekshiramiz
		let member = await this.memberModel.findOne({ memberEmail: email }).exec();

		if (!member) {
			// Yangi user yaratamiz
			member = await this.memberModel.create({
				memberNick: email.split('@')[0] + '_' + Date.now(),
				memberEmail: email,
				memberFullName: `${firstName} ${lastName}`,
				memberImage: picture,
				memberAuthType: MemberAuthType.GOOGLE,
				memberStatus: MemberStatus.ACTIVE,
				memberType: MemberType.USER,
			});
		}

		const token = await this.createToken(member);
		return { token };
	}
}
