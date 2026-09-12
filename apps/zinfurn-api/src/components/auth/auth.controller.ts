import { Controller, Get, Post, Body, Req, Res, UseGuards, Logger } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { TelegramStrategy } from './telegram.strategy';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly telegramStrategy: TelegramStrategy,
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
	async logout(@Res() res: any) {
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

			const memberId = cookies.linkMemberId || req.query?.state || user?.memberId;

			if (memberId) {
				// Account linking
				const result = await this.authService.linkGoogle(memberId, user);
				res.cookie('linkMemberId', '', { maxAge: 0 });
				this.setAuthCookie(res, result.token);
				return res.redirect(
					this.authRedirectUrl(isApp, '/mypage', { token: result.token, refresh: result.refresh }),
				);
			} else {
				// Normal login
				const result = await this.authService.googleLogin(user);
				this.setAuthCookie(res, result.token);
				return res.redirect(this.authRedirectUrl(isApp, '/', { token: result.token, refresh: result.refresh }));
			}
		} catch (err: any) {
			Logger.error('Google callback error:', err);
			const isApp = this.parseCookies(req).oauthClient === 'app';
			return res.redirect(this.authRedirectUrl(isApp, '/', { error: err.message }));
		}
	}

	@Throttle({ default: { limit: 10, ttl: 60000 } })
	@Post('telegram')
	async telegramAuth(@Body() telegramData: any, @Res() res: any) {
		const isValid = this.telegramStrategy.verifyTelegramAuth(telegramData);
		if (!isValid) {
			return res.status(401).json({ message: 'Invalid Telegram auth data' });
		}
		const result = await this.authService.telegramLogin(telegramData);
		this.setAuthCookie(res, result.token);
		return res.json({ token: result.token, refresh: result.refresh });
	}

	@Throttle({ default: { limit: 10, ttl: 60000 } })
	@Post('link/telegram')
	async linkTelegram(@Body() body: any, @Res() res: any) {
		const { memberId, ...telegramData } = body;
		const isValid = this.telegramStrategy.verifyTelegramAuth(telegramData);
		if (!isValid) {
			return res.status(401).json({ message: 'Invalid Telegram auth data' });
		}
		const result = await this.authService.linkTelegram(memberId, telegramData);
		this.setAuthCookie(res, result.token);
		return res.json({ token: result.token, refresh: result.refresh });
	}

	@Get('link/google')
	async linkGoogle(@Req() req: any, @Res() res: any) {
		// Store memberId in cookie BEFORE OAuth redirect
		const memberId = req.query.state;
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
		const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&response_type=code&scope=email%20profile&state=${memberId}`;
		res.redirect(googleAuthUrl);
	}

	@Get('link/google/callback')
	@UseGuards(AuthGuard('google'))
	async linkGoogleCallback(@Req() req: any, @Res() res: any) {
		const isApp = this.parseCookies(req).oauthClient === 'app';
		if (isApp) res.cookie('oauthClient', '', { maxAge: 0 });
		try {
			const memberId = req.user?.memberId;
			if (!memberId) {
				return res.redirect(this.authRedirectUrl(isApp, '/mypage', { error: 'No memberId found' }));
			}
			const result = await this.authService.linkGoogle(memberId, req.user);
			res.redirect(this.authRedirectUrl(isApp, '/mypage', { token: result.token, refresh: result.refresh }));
		} catch (err: any) {
			res.redirect(this.authRedirectUrl(isApp, '/mypage', { error: err.message }));
		}
	}
}