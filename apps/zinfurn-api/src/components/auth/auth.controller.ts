import { Controller, Get, Post, Body, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as passport from 'passport';
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
		const user = req.user;
		const result = await this.authService.googleLogin(user);
		const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
		res.redirect(`${frontendUrl}/?token=${result.token}`);
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
		// Store memberId in session BEFORE OAuth redirect
		req.session = req.session || {};
		req.session.linkMemberId = req.query.state;

		// Manually trigger Google OAuth
		passport.authenticate('google')(req, res);
	}

	@Get('link/google/callback')
	@UseGuards(AuthGuard('google'))
	async linkGoogleCallback(@Req() req: any, @Res() res: any) {
		try {
			const memberId = req.session?.linkMemberId || req.user?.memberId;
			if (!memberId) {
				return res.redirect(`${process.env.FRONTEND_URL}/mypage?error=No memberId found`);
			}
			// Clear session after use
			delete req.session.linkMemberId;

			const result = await this.authService.linkGoogle(memberId as string, req.user);
			res.redirect(`${process.env.FRONTEND_URL}/mypage?token=${result.token}`);
		} catch (err: any) {
			res.redirect(`${process.env.FRONTEND_URL}/mypage?error=${encodeURIComponent(err.message)}`);
		}
	}
}