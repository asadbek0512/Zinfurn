import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SecurityAlertService, SecurityEventType } from './security-alert.service';

/** SQL/NoSQL/XSS injection imzolari (payload ichida izlanadi). */
const INJECTION_PATTERNS: RegExp[] = [
	/\bunion\b[\s\S]{0,30}\bselect\b/i,
	/\bselect\b[\s\S]{0,40}\bfrom\b/i,
	/\b(or|and)\b\s+['"]?\d+['"]?\s*=\s*['"]?\d+/i, // ' OR 1=1
	/;\s*(drop|delete|update|insert)\s+/i,
	/\bsleep\s*\(\s*\d+\s*\)/i,
	/\$where\b|\$ne\b|\$gt\b|\$regex\b/i, // MongoDB operator injection
	/<script[\s>]|javascript:|onerror\s*=|onload\s*=/i, // XSS
];

/** Path traversal imzolari (URL'da). */
const TRAVERSAL_PATTERNS: RegExp[] = [/\.\.[\/\\]/, /%2e%2e[%2f%5c]/i, /\/etc\/passwd/i, /\/proc\/self/i];

/** Avtomatik skanerlar qidiradigan yo'llar. */
const SCANNER_PATHS: RegExp[] = [
	/\.env$/i,
	/\/wp-(login|admin|content)/i,
	/\/phpmyadmin/i,
	/\/\.git\//i,
	/\/admin\.php/i,
	/\/(vendor|config)\/.*\.(php|yml|yaml)$/i,
	/\.(bak|sql|sqlite|old|backup)$/i,
];

/**
 * Har bir HTTP so'rovni hujum imzolariga qarab tekshiradi va topilsa admin'ga alert yuboradi.
 * - To'sib qo'ymaydi (false-positive legal so'rovni buzmasligi uchun) — faqat ogohlantiradi.
 *   Istisno: aniq path traversal/scanner probe 404 bilan qaytariladi.
 * - Alert xizmati o'zi dedup qiladi, shuning uchun skaner yomg'iri 1 ta xabar bo'ladi.
 */
@Injectable()
export class SecurityMiddleware implements NestMiddleware {
	constructor(private readonly alert: SecurityAlertService) {}

	use(req: Request, res: Response, next: NextFunction): void {
		const ip = this.clientIp(req);
		const path = req.originalUrl || req.url || '';
		const ua = String(req.headers['user-agent'] || '');

		// 1) Path traversal / skaner — URL bo'yicha
		if (TRAVERSAL_PATTERNS.some((re) => re.test(path))) {
			this.alert.report({ type: SecurityEventType.PATH_TRAVERSAL, detail: 'URLda path traversal imzosi', ip, path, userAgent: ua });
			res.status(404).end();
			return;
		}
		if (SCANNER_PATHS.some((re) => re.test(path))) {
			this.alert.report({ type: SecurityEventType.SCANNER_PROBE, detail: `Skaner yo'liga murojaat: ${path}`, ip, path, userAgent: ua });
			res.status(404).end();
			return;
		}

		// 2) Injection — body + query ichida (GraphQL variables shu yerda)
		const haystack = this.payloadString(req);
		if (haystack) {
			const hit = INJECTION_PATTERNS.find((re) => re.test(haystack));
			if (hit) {
				this.alert.report({
					type: SecurityEventType.INJECTION_ATTEMPT,
					detail: `Payloadda imzo topildi: ${hit.source.slice(0, 60)}`,
					ip,
					path,
					userAgent: ua,
				});
				// bloklamaymiz — Mongoose/GraphQL o'zi parametrlashtiradi; faqat ogohlantiramiz
			}
		}

		next();
	}

	private clientIp(req: Request): string {
		const xff = req.headers['x-forwarded-for'];
		if (typeof xff === 'string' && xff.length) return xff.split(',')[0].trim();
		return req.ip || req.socket?.remoteAddress || 'unknown';
	}

	/** Body + query'ni stringga aylantiradi (cheklangan uzunlik — katta rasmlar skanni sekinlashtirmasin). */
	private payloadString(req: Request): string {
		const MAX = 20000;
		let out = '';
		try {
			if (req.query && Object.keys(req.query).length) out += JSON.stringify(req.query);
			if (req.body && typeof req.body === 'object') out += JSON.stringify(req.body).slice(0, MAX);
			else if (typeof req.body === 'string') out += req.body.slice(0, MAX);
		} catch {
			/* bo'sh */
		}
		return out.slice(0, MAX);
	}
}
