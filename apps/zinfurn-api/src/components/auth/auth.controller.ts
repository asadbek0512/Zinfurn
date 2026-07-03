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

	@Get('google')
	@UseGuards(AuthGuard('google'))
	async googleAuth() {}

	@Get('google/callback')
	@UseGuards(AuthGuard('google'))
	async googleAuthCallback(@Req() req: any, @Res() res: any) {
		try {
			
			const user = req.user;
			
			// Cookie dan memberId olish (manual parsing)
			const cookies = Object.fromEntries(
				(req.headers.cookie || '').split(';').map(c => {
					const [k, v] = c.trim().split('=');
					return [k, decodeURIComponent(v)];
				}).filter(([k]) => k)
			);
			
			const memberId = cookies.linkMemberId || req.query?.state || user?.memberId;

			const frontendUrl = this.getFrontendUrl();

			if (memberId) {
				// Account linking
				const result = await this.authService.linkGoogle(memberId, user);
				res.cookie('linkMemberId', '', { maxAge: 0 });
				this.setAuthCookie(res, result.token);
				return res.redirect(`${frontendUrl}/mypage?token=${result.token}&refresh=${result.refresh}`);
			} else {
				// Normal login
				const result = await this.authService.googleLogin(user);
				this.setAuthCookie(res, result.token);
				return res.redirect(`${frontendUrl}/?token=${result.token}&refresh=${result.refresh}`);
			}
		} catch (err: any) {
			Logger.error('Google callback error:', err);
			const frontendUrl = this.getFrontendUrl();
			return res.redirect(`${frontendUrl}/?error=${encodeURIComponent(err.message)}`);
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
		try {
			const frontendUrl = this.getFrontendUrl();
			const memberId = req.user?.memberId;
			if (!memberId) {
				return res.redirect(`${frontendUrl}/mypage?error=No memberId found`);
			}
			const result = await this.authService.linkGoogle(memberId, req.user);
			res.redirect(`${frontendUrl}/mypage?token=${result.token}&refresh=${result.refresh}`);
		} catch (err: any) {
			res.redirect(`${this.getFrontendUrl()}/mypage?error=${encodeURIComponent(err.message)}`);
		}
	}
}