import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '../../libs/dto/member/member';
import { OrderStatus } from '../../libs/enums/order.enum';

/**
 * Buyurtma holati o'zgarganda xaridorga email yuboradi (Resend REST API orqali).
 * MUHIM: to'liq non-blocking — email yiqilsa ham buyurtma oqimi buzilmaydi.
 * RESEND_API_KEY berilmagan bo'lsa — jimgina o'tkaziladi (dev/local uchun xavfsiz).
 * memberEmail bo'lmagan userga email yuborilmaydi.
 */
@Injectable()
export class MailNotifyService {
	private readonly logger = new Logger(MailNotifyService.name);

	constructor(@InjectModel('Member') private readonly memberModel: Model<Member>) {}

	// Faqat mijozga muhim bo'lgan holatlar uchun email (PROCESSING kabi oraliqlar spam qilmasin)
	private readonly EMAIL_STATUSES = new Set<OrderStatus>([
		OrderStatus.PENDING,
		OrderStatus.SHIPPED,
		OrderStatus.DELIVERED,
		OrderStatus.CONFIRMED,
		OrderStatus.CANCELLED,
		OrderStatus.RETURN_REQUESTED,
		OrderStatus.RETURNED,
	]);

	private readonly STATUS_TITLE: Record<string, string> = {
		[OrderStatus.PENDING]: 'Order received 🕐',
		[OrderStatus.SHIPPED]: 'Your order is on the way 🚚',
		[OrderStatus.DELIVERED]: 'Order delivered 📬',
		[OrderStatus.CONFIRMED]: 'Thank you for your purchase! ✅',
		[OrderStatus.CANCELLED]: 'Order cancelled ❌',
		[OrderStatus.RETURN_REQUESTED]: 'Return request received ↩️',
		[OrderStatus.RETURNED]: 'Order returned 🔄',
	};

	private readonly STATUS_LINE: Record<string, string> = {
		[OrderStatus.PENDING]: "We've received your order and will start preparing it shortly.",
		[OrderStatus.SHIPPED]: 'Your order has left our warehouse and is heading to you.',
		[OrderStatus.DELIVERED]: 'Your order has been delivered. We hope you love it — leave a review!',
		[OrderStatus.CONFIRMED]: 'Your order is complete. Thank you for shopping with Zinfurn!',
		[OrderStatus.CANCELLED]: 'Your order has been cancelled. If this was a mistake, please contact us.',
		[OrderStatus.RETURN_REQUESTED]: "We've received your return request and will process it soon.",
		[OrderStatus.RETURNED]: 'Your return has been completed.',
	};

	/** Xaridorga buyurtma holati haqida email (fire-and-forget) */
	public notifyCustomer(memberId: any, orderCode: string, status: OrderStatus, orderTotal?: number): void {
		if (!this.EMAIL_STATUSES.has(status)) return;
		this.send(memberId, orderCode, status, orderTotal).catch(() => undefined);
	}

	private async send(memberId: any, orderCode: string, status: OrderStatus, orderTotal?: number): Promise<void> {
		try {
			const member = await this.memberModel
				.findById(memberId)
				.select('memberEmail memberNick memberFullName')
				.exec();
			if (!member?.memberEmail) return;
			const name = member.memberFullName || member.memberNick || 'there';
			await this.sendRaw(
				member.memberEmail,
				`Zinfurn — ${this.STATUS_TITLE[status] ?? 'Order update'}`,
				this.buildHtml(name, orderCode, status, orderTotal),
			);
		} catch (err: any) {
			this.logger.warn(`Mail notify skipped: ${err?.message || err}`);
		}
	}

	private buildHtml(name: string, orderCode: string, status: OrderStatus, orderTotal?: number): string {
		const title = this.STATUS_TITLE[status] ?? 'Order update';
		const line = this.STATUS_LINE[status] ?? '';
		const amount = orderTotal ? `₩${Math.round(orderTotal).toLocaleString('en-US')}` : '';
		return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#f0ede8;font-family:'Poppins',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0ede8;padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:480px;width:100%;">
        <tr><td style="background:#3a3a3a;padding:24px 32px;">
          <span style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">Zinfurn</span>
        </td></tr>
        <tr><td style="padding:32px;">
          <h1 style="margin:0 0 8px;font-size:20px;color:#1a1a1a;">${title}</h1>
          <p style="margin:0 0 20px;font-size:15px;color:#555;line-height:1.6;">Hi ${this.escape(name)}, ${line}</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f2;border-radius:10px;padding:16px;">
            <tr><td style="font-size:13px;color:#888;padding-bottom:4px;">Order number</td></tr>
            <tr><td style="font-size:16px;color:#1a1a1a;font-weight:600;">${this.escape(orderCode)}</td></tr>
            ${amount ? `<tr><td style="font-size:13px;color:#888;padding:12px 0 4px;">Total</td></tr>
            <tr><td style="font-size:16px;color:#cf6422;font-weight:700;">${amount}</td></tr>` : ''}
          </table>
          <div style="text-align:center;margin-top:28px;">
            <a href="https://zinfurn.uz/mypage?category=myOrders"
               style="display:inline-block;background:#cf6422;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:12px 28px;border-radius:10px;">
              View my orders
            </a>
          </div>
        </td></tr>
        <tr><td style="padding:20px 32px;border-top:1px solid #eee;">
          <p style="margin:0;font-size:12px;color:#aaa;text-align:center;">
            © ${new Date().getFullYear()} Zinfurn — Best online furniture store<br/>
            <a href="https://zinfurn.uz" style="color:#cf6422;text-decoration:none;">zinfurn.uz</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
	}

	private escape(s: string): string {
		return String(s).replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c] as string));
	}

	private async sendRaw(to: string, subject: string, html: string): Promise<void> {
		const apiKey = process.env.RESEND_API_KEY;
		if (!apiKey) return; // kalit yo'q — jimgina o'tkazamiz (dev/local)
		const from = process.env.MAIL_FROM || 'Zinfurn <onboarding@resend.dev>';
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), 8000);
		try {
			const res = await fetch('https://api.resend.com/emails', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
				body: JSON.stringify({ from, to, subject, html }),
				signal: controller.signal,
			});
			if (!res.ok) {
				const body = await res.text();
				this.logger.warn(`Resend send ${res.status}: ${body.slice(0, 160)}`);
			}
		} finally {
			clearTimeout(timer);
		}
	}
}
