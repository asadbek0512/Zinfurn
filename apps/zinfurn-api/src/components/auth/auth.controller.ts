import { Controller, Get, Post, Body, Req, Res, UseGuards, Logger } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { AuthService, clientFromRequest } from './auth.service';
import { TelegramStrategy } from './telegram.strategy';
import { AppleIdentity, AppleVerifier } from './apple.verifier';

interface AppleAuthBody {
	identityToken: string;
	givenName?: string;
	familyName?: string;
}

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly telegramStrategy: TelegramStrategy,
		private readonly appleVerifier: AppleVerifier,
	) {}

	// FRONTEND_URL vergul bilan ajratilgan ro'yxat (CORS uchun) — redirect uchun bitta to'g'ri URL tanlaymiz
	private getFrontendUrl(): string {
		const urls = (process.env.FRONTEND_URL || 'http://localhost:3000')
			.split(',')
			.map((u) => u.trim())
			.filter(Boolean);
		if (process.env.NODE_ENV === 'production') {
			return urls.find((u) => u.startsWith('https://')) || urls[0];
		}
		return urls.find((u) => u.includes('localhost')) || urls[0];
	}

	// Mobil app (Capacitor) Google OAuth'ni tizim brauzerida ochadi — Google embedded
	// WebView'da OAuth'ni bloklaydi (disallowed_useragent). Callback esa app'ga custom
	// scheme deep link orqali qaytadi, sayt URL'iga emas.
	private getAppDeepLink(): string {
		return process.env.APP_DEEP_LINK || 'uz.zinfurn.app://auth';
	}

	private parseCookies(req: any): Record<string, string> {
		return Object.fromEntries(
			(req.headers.cookie || '')
				.split(';')
				.map((c: string) => {
					const [k, v] = c.trim().split('=');
					return [k, decodeURIComponent(v ?? '')];
				})
				.filter(([k]: string[]) => k),
		);
	}

	// path — muvaffaqiyatdan keyin ochiladigan sahifa ('/' yoki '/mypage')
	private authRedirectUrl(isApp: boolean, path: string, params: Record<string, string>): string {
		const qs = new URLSearchParams(params);
		if (isApp) {
			qs.set('target', path);
			return `${this.getAppDeepLink()}?${qs.toString()}`;
		}
		return `${this.getFrontendUrl()}${path}?${qs.toString()}`;
	}

	private setAuthCookie(res: any, token: string): void {
		res.cookie('accessToken', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60 * 1000,
		});
	}

	@Post('logout')
	async logout(@Body() body: any, @Res() res: any) {
		if (typeof body?.refreshToken === 'string') await this.authService.logoutSession(body.refreshToken);
		res.cookie('accessToken', '', { httpOnly: true, maxAge: 0 });
		return res.json({ success: true });
	}

	@Get('app/google')
	async googleAuthFromApp(@Res() res: any) {
		res.cookie('oauthClient', 'app', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 5 * 60 * 1000,
		});
		return res.redirect('/auth/google');
	}

	@Get('google')
	@UseGuards(AuthGuard('google'))
	async googleAuth() {}

	@Get('google/callback')
	@UseGuards(AuthGuard('google'))
	async googleAuthCallback(@Req() req: any, @Res() res: any) {
		try {
			
			const user = req.user;
			const cookies = this.parseCookies(req);
			const isApp = cookies.oauthClient === 'app';
			if (isApp) res.cookie('oauthClient', '', { maxAge: 0 });

			// Ulash: state/cookie'da imzolangan link token bo'lishi shart (ochiq memberId qabul qilinmaydi)
			const linkToken = cookies.linkMemberId || req.query?.state || user?.memberId;
			const memberId = linkToken ? await this.authService.verifyLinkToken(linkToken) : null;

			if (memberId) {
				// Account linking
				const result = await this.authService.linkGoogle(memberId, user, isApp ? 'app' : 'web');
				res.cookie('linkMemberId', '', { maxAge: 0 });
				this.setAuthCookie(res, result.token);
				return res.redirect(
					this.authRedirectUrl(isApp, '/mypage', { token: result.token, refresh: result.refresh }),
				);
			} else {
				// Normal login
				const result = await this.authService.googleLogin(user, isApp ? 'app' : 'web');
				this.setAuthCookie(res, result.token);
				return res.redirect(this.authRedirectUrl(isApp, '/', { token: result.token, refresh: result.refresh }));
			}
		} catch (err: any) {
			Logger.error('Google callback error:', err);
			const isApp = this.parseCookies(req).oauthClient === 'app';
			return res.redirect(this.authRedirectUrl(isApp, '/', { error: err.message }));
		}
	}

	// Sign in with Apple (iOS app, native oqim): identity token Apple kalitlari bilan tekshiriladi.
	// Ism faqat birinchi kirishda keladi — shuning uchun client yuboradi.
	@Throttle({ default: { limit: 10, ttl: 60000 } })
	@Post('apple')
	async appleAuth(@Body() body: AppleAuthBody, @Req() req: any, @Res() res: any) {
		let identity: AppleIdentity;
		try {
			identity = await this.appleVerifier.verify(body?.identityToken);
		} catch {
			return res.status(401).json({ message: 'Invalid Apple auth data' });
		}
		const fullName = [body.givenName, body.familyName].filter(Boolean).join(' ');
		const result = await this.authService.appleLogin(identity, fullName, clientFromRequest(req));
		this.setAuthCookie(res, result.token);
		return res.json({ token: result.token, refresh: result.refresh });
	}

	@Throttle({ default: { limit: 10, ttl: 60000 } })
	@Post('telegram')
	async telegramAuth(@Body() telegramData: any, @Req() req: any, @Res() res: any) {
		const isValid = this.telegramStrategy.verifyTelegramAuth(telegramData);
		if (!isValid) {
			return res.status(401).json({ message: 'Invalid Telegram auth data' });
		}
		const result = await this.authService.telegramLogin(telegramData, clientFromRequest(req));
		this.setAuthCookie(res, result.token);
		return res.json({ token: result.token, refresh: result.refresh });
	}

	// Mobil app: Telegram oauth tizim brauzerida ochiladi (WebView'da "Cancel" window.close()
	// ishlamay foydalanuvchi tiqilib qolardi). Sayt bridge sahifasi natijani query qilib shu
	// yerga yuboradi, biz esa app'ga deep link bilan qaytaramiz.
	@Throttle({ default: { limit: 10, ttl: 60000 } })
	@Get('app/telegram')
	async appTelegramAuth(@Req() req: any, @Res() res: any) {
		try {
			if (!this.telegramStrategy.verifyTelegramAuth({ ...req.query })) {
				return res.redirect(this.authRedirectUrl(true, '/', { error: 'Invalid Telegram auth data' }));
			}
			const result = await this.authService.telegramLogin({ ...req.query }, 'app');
			return res.redirect(this.authRedirectUrl(true, '/', { token: result.token, refresh: result.refresh }));
		} catch (err: any) {
			Logger.error('Telegram app login error:', err);
			return res.redirect(this.authRedirectUrl(true, '/', { error: 'Telegram login failed' }));
		}
	}

	private async memberIdFromBearer(req: any): Promise<string> {
		const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
		if (!token) throw new Error('Login required');
		const member = await this.authService.verifyToken(token);
		return String(member._id);
	}

	// Ulash oqimi tashqi sahifadan (Telegram/Google) o'tadi — memberId o'rniga imzolangan,
	// 10 daqiqalik link token yuriladi. Avval memberId ochiq qabul qilinardi: begona odam o'z
	// Telegram'ini istalgan akkauntga ulab, o'sha akkaunt token'ini olishi mumkin edi.
	@Throttle({ default: { limit: 10, ttl: 60000 } })
	@Post('link-token')
	async linkToken(@Req() req: any, @Res() res: any) {
		try {
			const memberId = await this.memberIdFromBearer(req);
			return res.json({ linkToken: await this.authService.createLinkToken(memberId) });
		} catch {
			return res.status(401).json({ message: 'Login required' });
		}
	}

	@Throttle({ default: { limit: 10, ttl: 60000 } })
	@Post('link/telegram')
	async linkTelegram(@Body() body: any, @Req() req: any, @Res() res: any) {
		const { memberId: _ignored, ...telegramData } = body;
		let memberId: string;
		try {
			memberId = await this.memberIdFromBearer(req);
		} catch {
			return res.status(401).json({ message: 'Login required' });
		}
		if (!this.telegramStrategy.verifyTelegramAuth(telegramData)) {
			return res.status(401).json({ message: 'Invalid Telegram auth data' });
		}
		try {
			const result = await this.authService.linkTelegram(memberId, telegramData, clientFromRequest(req));
			this.setAuthCookie(res, result.token);
			return res.json({ token: result.token, refresh: result.refresh });
		} catch (err: any) {
			return res.status(400).json({ message: err.message });
		}
	}

	// Mobil app: Telegram ulash tizim brauzerida, natija deep link bilan /mypage'ga qaytadi
	@Throttle({ default: { limit: 10, ttl: 60000 } })
	@Get('app/link/telegram')
	async appLinkTelegram(@Req() req: any, @Res() res: any) {
		const { linkToken, ...telegramData } = req.query;
		try {
			const memberId = await this.authService.verifyLinkToken(linkToken);
			if (!this.telegramStrategy.verifyTelegramAuth(telegramData)) {
				return res.redirect(this.authRedirectUrl(true, '/mypage', { error: 'Invalid Telegram auth data' }));
			}
			const result = await this.authService.linkTelegram(memberId, telegramData, 'app');
			return res.redirect(this.authRedirectUrl(true, '/mypage', { token: result.token, refresh: result.refresh }));
		} catch (err: any) {
			return res.redirect(this.authRedirectUrl(true, '/mypage', { error: err.message || 'Telegram link failed' }));
		}
	}

	@Get('link/google')
	async linkGoogle(@Req() req: any, @Res() res: any) {
		// state = link token (memberId emas) — callback'da qayta tekshiriladi
		const memberId = req.query.state;
		try {
			await this.authService.verifyLinkToken(memberId);
		} catch {
			return res.redirect(this.authRedirectUrl(req.query.client === 'app', '/mypage', { error: 'Login required' }));
		}
		// App'dan kelgan bo'lsa — callback deep link orqali qaytsin
		if (req.query.client === 'app') {
			res.cookie('oauthClient', 'app', {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: 5 * 60 * 1000,
			});
		}
		res.cookie('linkMemberId', memberId, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 5 * 60 * 1000, // 5 minutes
		});

		// Trigger Google OAuth
		const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&response_type=code&scope=email%20profile&state=${encodeURIComponent(memberId)}`;
		res.redirect(googleAuthUrl);
	}

	@Get('link/google/callback')
	@UseGuards(AuthGuard('google'))
	async linkGoogleCallback(@Req() req: any, @Res() res: any) {
		const isApp = this.parseCookies(req).oauthClient === 'app';
		if (isApp) res.cookie('oauthClient', '', { maxAge: 0 });
		try {
			const memberId = req.user?.memberId ? await this.authService.verifyLinkToken(req.user.memberId) : null;
			if (!memberId) {
				return res.redirect(this.authRedirectUrl(isApp, '/mypage', { error: 'No memberId found' }));
			}
			const result = await this.authService.linkGoogle(memberId, req.user, isApp ? 'app' : 'web');
			res.redirect(this.authRedirectUrl(isApp, '/mypage', { token: result.token, refresh: result.refresh }));
		} catch (err: any) {
			res.redirect(this.authRedirectUrl(isApp, '/mypage', { error: err.message }));
		}
	}
}