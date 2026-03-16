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
    const user = req.user;
    const result = await this.authService.googleLogin(user);
    res.redirect(`${process.env.FRONTEND_URL}/?token=${result.token}`);
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
}