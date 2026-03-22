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

  // Google login
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  // Google callback
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: any, @Res() res: any) {
    const user = req.user;
    const result = await this.authService.googleLogin(user);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/?token=${result.token}`);
  }

  // Telegram login
  @Post('telegram')
  async telegramAuth(@Body() telegramData: any, @Res() res: any) {
    const isValid = this.telegramStrategy.verifyTelegramAuth(telegramData);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid Telegram auth data' });
    }
    const result = await this.authService.telegramLogin(telegramData);
    return res.json({ token: result.token });
  }

  // Mavjud akkauntga Telegram bog'lash
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

  // Mavjud akkauntga Google bog'lash
  @Get('link/google')
  @UseGuards(AuthGuard('google'))
  async linkGoogle(@Req() req: any, @Res() res: any) {
    const memberId = req.query.state;
    
    if (!memberId) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/mypage?error=No memberId provided`);
    }
    
    // Store memberId in session for callback
    req.session = req.session || {};
    req.session.linkMemberId = memberId;
  }

  // Google link callback
  @Get('link/google/callback')
  @UseGuards(AuthGuard('google'))
  async linkGoogleCallback(@Req() req: any, @Res() res: any) {
    try {
      // Get memberId from state or session
      const memberId = req.query.state || req.session?.linkMemberId;
      
      if (!memberId) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        return res.redirect(`${frontendUrl}/mypage?error=No memberId found`);
      }
      
      const result = await this.authService.linkGoogle(memberId, req.user);
      
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/mypage?token=${result.token}`);
    } catch (err: any) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/mypage?error=${encodeURIComponent(err.message)}`);
    }
  }
}