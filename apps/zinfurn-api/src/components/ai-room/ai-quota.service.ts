import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Message } from '../../libs/enums/common_enum';

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_MEMBER_DAILY_LIMIT = 10;
const DEFAULT_ANON_DAILY_LIMIT = 3;
// Xotira o'smasligi uchun: har N ta tekshiruvda muddati o'tgan yozuvlar tozalanadi
const CLEANUP_EVERY = 500;

interface QuotaEntry {
	count: number;
	resetAt: number;
}

/**
 * AI so'rovlari (Gemini vision / image generation) uchun kunlik xarajat nazorati.
 * Har chaqiruv pul turadi, shuning uchun foydalanuvchi (yoki anonim IP) kuniga
 * cheklangan miqdorda so'rov yubora oladi.
 *
 * Hisob xotirada saqlanadi — server qayta ishga tushsa nolga qaytadi. Bitta
 * instance uchun yetarli; ko'p instance bo'lsa Redis'ga ko'chirish kerak.
 */
@Injectable()
export class AiQuotaService {
	private readonly logger = new Logger(AiQuotaService.name);
	private readonly entries = new Map<string, QuotaEntry>();
	private checkCount = 0;

	private get memberLimit(): number {
		return Number(process.env.AI_DAILY_LIMIT_MEMBER) || DEFAULT_MEMBER_DAILY_LIMIT;
	}

	private get anonLimit(): number {
		return Number(process.env.AI_DAILY_LIMIT_ANON) || DEFAULT_ANON_DAILY_LIMIT;
	}

	/**
	 * Kunlik limitni tekshiradi va hisobni bittaga oshiradi.
	 * Limit tugagan bo'lsa ForbiddenException tashlaydi.
	 */
	public consume(memberId?: string, ip?: string): void {
		const key = memberId ? `member:${memberId}` : `ip:${ip || 'unknown'}`;
		const limit = memberId ? this.memberLimit : this.anonLimit;
		const now = Date.now();

		if (++this.checkCount % CLEANUP_EVERY === 0) this.cleanup(now);

		const entry = this.entries.get(key);
		if (!entry || entry.resetAt <= now) {
			this.entries.set(key, { count: 1, resetAt: now + DAY_MS });
			return;
		}

		if (entry.count >= limit) {
			this.logger.warn(`AI daily limit reached: ${key} (${entry.count}/${limit})`);
			throw new ForbiddenException(Message.DAILY_AI_LIMIT_REACHED);
		}

		entry.count += 1;
	}

	private cleanup(now: number): void {
		for (const [key, entry] of this.entries) {
			if (entry.resetAt <= now) this.entries.delete(key);
		}
	}
}
