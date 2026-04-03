import { Controller, Get, Post, Body, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { TelegramStrategy } from './telegram.strategy';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly telegramStrategy: TelegramStrategy,
	) {}

	@Get('google')
	@UseGuards(AuthGuard('google'))
	async googleAuth() {}

	@Get('google/callback')
	@UseGuards(AuthGuard('google'))
	async googleAuthCallback(@Req() req: any, @Res() res: any) {
		try {
			console.log('=== GOOGLE CALLBACK DEBUG ===');
			console.log('req.query:', req.query);
			console.log('req.user:', req.user);
			
			const user = req.user;
			
			// Cookie dan memberId olish (manual parsing)
			const cookies = Object.fromEntries(
				(req.headers.cookie || '').split(';').map(c => {
					const [k, v] = c.trim().split('=');
					return [k, decodeURIComponent(v)];
				}).filter(([k]) => k)
			);
			console.log('Parsed cookies:', cookies);
			
			const memberId = cookies.linkMemberId || req.query?.state || user?.memberId;
			console.log('memberId:', memberId);
			
			const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

			if (memberId) {
				// Account linking
				console.log('🔗 Account linking for memberId:', memberId);
				const result = await this.authService.linkGoogle(memberId, user);
				// Cookie ni tozalash
				res.cookie('linkMemberId', '', { maxAge: 0 });
				return res.redirect(`${frontendUrl}/mypage?token=${result.token}`);
			} else {
				// Normal login
				console.log('🔑 Normal Google login');
				const result = await this.authService.googleLogin(user);
				return res.redirect(`${frontendUrl}/?token=${result.token}`);
			}
		} catch (err: any) {
			console.error('Google callback error:', err);
			const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
			return res.redirect(`${frontendUrl}/?error=${encodeURIComponent(err.message)}`);
		}
	}

	@Post('telegram')
	async telegramAuth(@Body() telegramData: any, @Res() res: any) {
		const isValid = this.telegramStrategy.verifyTelegramAuth(telegramData);
		if (!isValid) {
			return res.status(401).json({ message: 'Invalid Telegram auth data' });
		}
		const result = await this.authService.telegramLogin(telegramData);
		return res.json({ token: result.token });
	}

	@Post('link/telegram')
	async linkTelegram(@Body() body: any, @Res() res: any) {
		const { memberId, ...telegramData } = body;
		const isValid = this.telegramStrategy.verifyTelegramAuth(telegramData);
		if (!isValid) {
			return res.status(401).json({ message: 'Invalid Telegram auth data' });
		}
		const result = await this.authService.linkTelegram(memberId, telegramData);
		return res.json({ token: result.token });
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
			const memberId = req.user?.memberId;
			if (!memberId) {
				return res.redirect(`${process.env.FRONTEND_URL}/mypage?error=No memberId found`);
			}
			const result = await this.authService.linkGoogle(memberId, req.user);
			res.redirect(`${process.env.FRONTEND_URL}/mypage?token=${result.token}`);
		} catch (err: any) {
			res.redirect(`${process.env.FRONTEND_URL}/mypage?error=${encodeURIComponent(err.message)}`);
		}
	}
}