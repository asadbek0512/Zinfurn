import { Injectable, Logger } from '@nestjs/common';

/** Hujum turlari — alert matnida va dedup kalitida ishlatiladi. */
export enum SecurityEventType {
	PRIVILEGE_ESCALATION = 'PRIVILEGE_ESCALATION', // user o'z rolini oshirishga urindi
	UNAUTHORIZED_ADMIN = 'UNAUTHORIZED_ADMIN', // admin endpoint'ga ruxsatsiz kirish
	AUTH_BRUTE_FORCE = 'AUTH_BRUTE_FORCE', // bir IP'dan ketma-ket noto'g'ri token/login
	INJECTION_ATTEMPT = 'INJECTION_ATTEMPT', // SQLi / NoSQLi / XSS payload
	PATH_TRAVERSAL = 'PATH_TRAVERSAL', // ../ yoki /etc/passwd kabi
	SCANNER_PROBE = 'SCANNER_PROBE', // .env, wp-login, /admin.php kabi avtomatik skaner
	RATE_LIMIT = 'RATE_LIMIT', // throttler limiti oshib ketdi
}

export interface SecurityEvent {
	type: SecurityEventType;
	/** Qisqa izoh — nima aniqlandi. */
	detail: string;
	ip?: string;
	path?: string;
	userAgent?: string;
	/** Agar login bo'lgan bo'lsa — member _id. */
	memberId?: string;
}

const COOLDOWN_MS = Number(process.env.SECURITY_ALERT_COOLDOWN_MS) || 5 * 60 * 1000; // 5 daqiqa
const TELEGRAM_TIMEOUT_MS = 8000;

interface DedupEntry {
	firstAt: number;
	lastSentAt: number;
	suppressed: number;
}

/**
 * Hujum/anomaliyalarni admin'ga Telegram + Email orqali yetkazadi.
 * - To'liq non-blocking (fire-and-forget) — alert yiqilsa ham so'rov oqimi buzilmaydi.
 * - Dedup: bir xil (type+IP) hodisa COOLDOWN ichida bir marta yuboriladi,
 *   oraliqdagi urinishlar sanaladi va keyingi alert'da "yana N marta" ko'rsatiladi.
 *   Shu bilan brute-force 1000 ta emas, 1 ta xabar qiladi.
 */
@Injectable()
export class SecurityAlertService {
	private readonly logger = new Logger(SecurityAlertService.name);
	private readonly dedup = new Map<string, DedupEntry>();
	/** Per-IP auth-failure oynasi (brute-force aniqlash uchun). */
	private readonly authFails = new Map<string, { count: number; windowStart: number }>();

	private readonly LABELS: Record<SecurityEventType, string> = {
		[SecurityEventType.PRIVILEGE_ESCALATION]: '🚨 Rol oshirishga urinish (privilege escalation)',
		[SecurityEventType.UNAUTHORIZED_ADMIN]: '🛑 Ruxsatsiz admin kirish urinishi',
		[SecurityEventType.AUTH_BRUTE_FORCE]: '🔐 Auth brute-force',
		[SecurityEventType.INJECTION_ATTEMPT]: '💉 Injection urinishi (SQL/NoSQL/XSS)',
		[SecurityEventType.PATH_TRAVERSAL]: '📂 Path traversal urinishi',
		[SecurityEventType.SCANNER_PROBE]: '🤖 Avtomatik skaner (bot) probe',
		[SecurityEventType.RATE_LIMIT]: '⏱ Rate-limit oshib ketdi',
	};

	/** Hodisani qayd qiladi va (dedup chegarasida) admin'ga yuboradi. */
	public report(event: SecurityEvent): void {
		const key = `${event.type}:${event.ip ?? 'unknown'}`;
		const now = Date.now();
		const entry = this.dedup.get(key);

		if (entry && now - entry.lastSentAt < COOLDOWN_MS) {
			entry.suppressed += 1;
			return; // cooldown ichida — jim sanaymiz
		}

		const suppressed = entry?.suppressed ?? 0;
		this.dedup.set(key, { firstAt: entry?.firstAt ?? now, lastSentAt: now, suppressed: 0 });
		this.cleanup(now);

		this.logger.warn(`SECURITY [${event.type}] ip=${event.ip} path=${event.path} — ${event.detail}`);
		this.dispatch(event, suppressed).catch(() => undefined);
	}

	/**
	 * Auth muvaffaqiyatsizligini qayd qiladi (noto'g'ri parol/token).
	 * Oyna ichida chegaradan oshsa — AUTH_BRUTE_FORCE alert chiqaradi.
	 */
	public noteAuthFailure(ip: string | undefined, detail: string, path?: string, userAgent?: string): void {
		const key = ip ?? 'unknown';
		const now = Date.now();
		const windowMs = Number(process.env.AUTH_BRUTE_WINDOW_MS) || 60 * 1000; // 1 daqiqa
		const threshold = Number(process.env.AUTH_BRUTE_THRESHOLD) || 8; // oynada 8 ta xato
		const entry = this.authFails.get(key);
		if (!entry || now - entry.windowStart > windowMs) {
			this.authFails.set(key, { count: 1, windowStart: now });
			return;
		}
		entry.count += 1;
		if (entry.count >= threshold) {
			this.authFails.delete(key);
			this.report({
				type: SecurityEventType.AUTH_BRUTE_FORCE,
				detail: `${entry.count}+ muvaffaqiyatsiz urinish ${Math.round(windowMs / 1000)}s ichida — ${detail}`,
				ip,
				path,
				userAgent,
			});
		}
	}

	private async dispatch(event: SecurityEvent, suppressed: number): Promise<void> {
		const ts = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Tashkent' });
		const lines = [
			`<b>${this.LABELS[event.type]}</b>`,
			`🕒 ${ts}`,
			event.ip ? `🌐 IP: <code>${this.esc(event.ip)}</code>` : '',
			event.path ? `📍 Path: <code>${this.esc(event.path)}</code>` : '',
			event.memberId ? `👤 Member: <code>${this.esc(event.memberId)}</code>` : '',
			event.userAgent ? `🧭 UA: <code>${this.esc(event.userAgent.slice(0, 120))}</code>` : '',
			`📝 ${this.esc(event.detail)}`,
			suppressed > 0 ? `\n⚠️ Oxirgi xabardan beri yana <b>${suppressed}</b> marta takrorlandi.` : '',
		].filter(Boolean);

		const html = lines.join('\n');
		await Promise.all([this.sendTelegram(html), this.sendEmail(this.LABELS[event.type], lines)]);
	}

	private async sendTelegram(html: string): Promise<void> {
		const token = process.env.TELEGRAM_BOT_TOKEN;
		const chatId = process.env.ADMIN_TELEGRAM_CHAT_ID;
		if (!token || !chatId) return;
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), TELEGRAM_TIMEOUT_MS);
		try {
			const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ chat_id: chatId, text: html, parse_mode: 'HTML', disable_web_page_preview: true }),
				signal: controller.signal,
			});
			if (!res.ok) this.logger.warn(`Security Telegram ${res.status}: ${(await res.text()).slice(0, 120)}`);
		} catch (err: any) {
			this.logger.warn(`Security Telegram skipped: ${err?.message || err}`);
		} finally {
			clearTimeout(timer);
		}
	}

	private async sendEmail(subject: string, lines: string[]): Promise<void> {
		const apiKey = process.env.RESEND_API_KEY;
		const to = process.env.ADMIN_ALERT_EMAIL;
		if (!apiKey || !to) return;
		const from = process.env.MAIL_FROM || 'Zinfurn Security <onboarding@resend.dev>';
		const html = `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#1a1a1a;">${lines
			.map((l) => l.replace(/\n/g, '<br>'))
			.join('<br>')}</div>`;
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), TELEGRAM_TIMEOUT_MS);
		try {
			const res = await fetch('https://api.resend.com/emails', {
				method: 'POST',
				headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
				body: JSON.stringify({ from, to, subject: `[Zinfurn Security] ${subject}`, html }),
				signal: controller.signal,
			});
			if (!res.ok) this.logger.warn(`Security Resend ${res.status}: ${(await res.text()).slice(0, 160)}`);
		} catch (err: any) {
			this.logger.warn(`Security email skipped: ${err?.message || err}`);
		} finally {
			clearTimeout(timer);
		}
	}

	/** Eski dedup yozuvlarini tozalaydi (xotira o'smasin). */
	private cleanup(now: number): void {
		if (this.dedup.size < 500) return;
		for (const [key, entry] of this.dedup) {
			if (now - entry.lastSentAt > COOLDOWN_MS * 4) this.dedup.delete(key);
		}
	}

	private esc(s: string): string {
		return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}
}
