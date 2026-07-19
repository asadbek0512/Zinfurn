import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '../../libs/dto/member/member';
import { MemberAuthType, MemberStatus, MemberType } from '../../libs/enums/member.enum';
import * as crypto from 'crypto';

// Telegram login payload amal qilish muddati (soniya) — replay attack himoyasi
const TELEGRAM_AUTH_TTL_SEC = 86400; // 24 soat

@Injectable()
export class TelegramStrategy {
  constructor(
    @InjectModel('Member') private readonly memberModel: Model<Member>,
  ) {}

  // Telegram dan kelgan ma'lumotlarni tekshiradi
  verifyTelegramAuth(data: any): boolean {
    const botToken = process.env.TELEGRAM_BOT_TOKEN as string;
    if (!botToken) return false;

    const { hash, ...userData } = data;
    if (!hash || typeof hash !== 'string') return false;

    // Replay himoyasi: eski (ushlab olingan) login payload qayta ishlatilmasin
    const authDate = Number(userData.auth_date);
    if (!authDate || Date.now() / 1000 - authDate > TELEGRAM_AUTH_TTL_SEC) {
      return false;
    }

    const secretKey = crypto.createHash('sha256').update(botToken).digest();

    // Ma'lumotlarni tekshirish uchun string yaratamiz
    const checkString = Object.keys(userData)
      .sort()
      .map((key) => `${key}=${userData[key]}`)
      .join('\n');

    const hmac = crypto
      .createHmac('sha256', secretKey)
      .update(checkString)
      .digest('hex');

    // Timing-safe solishtirish (uzunlik farq qilsa throw bo'lmasin — false qaytadi)
    const hmacBuf = Buffer.from(hmac, 'hex');
    const hashBuf = Buffer.from(hash, 'hex');
    if (hmacBuf.length !== hashBuf.length) return false;
    return crypto.timingSafeEqual(hmacBuf, hashBuf);
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