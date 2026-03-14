import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Google sahifasiga yo'naltiradi
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: any, @Res() res: any) {
    const user = req.user;
    
    // User ni DB ga saqlash yoki topish
    const result = await this.authService.googleLogin(user);
    
    // Frontendga JWT bilan yo'naltirish
    res.redirect(`${process.env.FRONTEND_URL}/?token=${result.token}`);
  }
}