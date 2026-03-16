import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '../../libs/dto/member/member';
import { MemberAuthType, MemberStatus, MemberType } from '../../libs/enums/member.enum';
import * as crypto from 'crypto';

@Injectable()
export class TelegramStrategy {
  constructor(
    @InjectModel('Member') private readonly memberModel: Model<Member>,
  ) {}

  // Telegram dan kelgan ma'lumotlarni tekshiradi
  verifyTelegramAuth(data: any): boolean {
    const botToken = process.env.TELEGRAM_BOT_TOKEN as string;
    const secretKey = crypto.createHash('sha256').update(botToken).digest();

    const { hash, ...userData } = data;

    // Ma'lumotlarni tekshirish uchun string yaratamiz
    const checkString = Object.keys(userData)
      .sort()
      .map((key) => `${key}=${userData[key]}`)
      .join('\n');

    const hmac = crypto
      .createHmac('sha256', secretKey)
      .update(checkString)
      .digest('hex');

    return hmac === hash;
  }

  // Telegram user ni DB ga saqlaydi yoki topadi
  async telegramLogin(telegramUser: any): Promise<Member> {
    const { id, first_name, last_name, username, photo_url } = telegramUser;

    let member = await this.memberModel
      .findOne({ memberTelegramId: String(id) })
      .exec();

    if (!member) {
      member = await this.memberModel.create({
        memberNick: username || `tg_${id}`,
        memberFullName: `${first_name} ${last_name || ''}`.trim(),
        memberImage: photo_url || '',
        memberAuthType: MemberAuthType.TELEGRAM,
        memberStatus: MemberStatus.ACTIVE,
        memberType: MemberType.USER,
        memberTelegramId: String(id),
      });
    }

    return member;
  }
}