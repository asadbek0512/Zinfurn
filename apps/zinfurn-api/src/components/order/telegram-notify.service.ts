import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '../../libs/dto/member/member';
import { OrderStatus } from '../../libs/enums/order.enum';

/**
 * Buyurtma holati o'zgarganda xaridorga Telegram orqali xabar yuboradi.
 * MUHIM: to'liq non-blocking — Telegram yiqilsa ham buyurtma oqimi buzilmaydi.
 * Xabar faqat Telegram bog'langan (memberTelegramId bor) va botni ochgan userlarga boradi;
 * botni hech qachon ochmagan userga Telegram 403 qaytaradi — bu ham jimgina o'tkaziladi.
 * ADMIN_TELEGRAM_CHAT_ID env berilsa — har yangi buyurtmada adminga ham xabar boradi.
 */
@Injectable()
export class TelegramNotifyService {
	private readonly logger = new Logger(TelegramNotifyService.name);

	constructor(@InjectModel('Member') private readonly memberModel: Model<Member>) {}

	private readonly STATUS_TEXT: Record<string, string> = {
		[OrderStatus.PENDING]: "🕐 Qabul qilindi — tez orada tayyorlaymiz",
		[OrderStatus.PROCESSING]: '📦 Tayyorlanmoqda',
		[OrderStatus.SHIPPED]: "🚚 Yo'lga chiqdi",
		[OrderStatus.DELIVERED]: '📬 Yetkazib berildi',
		[OrderStatus.CONFIRMED]: '✅ Yakunlandi — xaridingiz uchun rahmat!',
		[OrderStatus.CANCELLED]: '❌ Bekor qilindi',
		[OrderStatus.RETURN_REQUESTED]: "↩️ Qaytarish so'rovi qabul qilindi",
		[OrderStatus.RETURNED]: '🔄 Qaytarildi',
	};

	/** Xaridorga buyurtma holati haqida xabar (fire-and-forget) */
	public notifyCustomer(memberId: any, orderCode: string, status: OrderStatus, orderTotal?: number): void {
		this.send(memberId, this.buildMessage(orderCode, status, orderTotal)).catch(() => undefined);
	}

	/** Adminga yangi buyurtma haqida xabar (env bo'lsa) */
	public notifyAdminNewOrder(orderCode: string, orderTotal: number, itemsCount: number): void {
		const chatId = process.env.ADMIN_TELEGRAM_CHAT_ID;
		if (!chatId) return;
		const text =
			`🆕 <b>Yangi buyurtma!</b>\n` +
			`📦 <code>${orderCode}</code>\n` +
			`🛒 Mahsulotlar: ${itemsCount} ta\n` +
			`💰 Summa: ${this.formatAmount(orderTotal)}`;
		this.sendRaw(chatId, text).catch(() => undefined);
	}

	private buildMessage(orderCode: string, status: OrderStatus, orderTotal?: number): string {
		const lines = [
			`🛋 <b>Zinfurn</b> — buyurtma yangilandi`,
			`📦 Buyurtma: <code>${orderCode}</code>`,
			`Holat: <b>${this.STATUS_TEXT[status] ?? status}</b>`,
		];
		if (orderTotal) lines.push(`💰 Summa: ${this.formatAmount(orderTotal)}`);
		lines.push(`\n🔗 zinfurn.uz/mypage?category=myOrders`);
		return lines.join('\n');
	}

	private formatAmount(n: number): string {
		return `₩${Math.round(n).toLocaleString('en-US')}`;
	}

	private async send(memberId: any, text: string): Promise<void> {
		try {
			const member = await this.memberModel.findById(memberId).select('memberTelegramId').exec();
			if (!member?.memberTelegramId) return;
			await this.sendRaw(member.memberTelegramId, text);
		} catch (err: any) {
			this.logger.warn(`Telegram notify skipped: ${err?.message || err}`);
		}
	}

	private async sendRaw(chatId: string, text: string): Promise<void> {
		const token = process.env.TELEGRAM_BOT_TOKEN;
		if (!token) return;
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), 8000);
		try {
			const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
				signal: controller.signal,
			});
			if (!res.ok) {
				const body = await res.text();
				// 403 = user botni ochmagan — normal holat, warn darajasida
				this.logger.warn(`Telegram sendMessage ${res.status}: ${body.slice(0, 120)}`);
			}
		} finally {
			clearTimeout(timer);
		}
	}
}
