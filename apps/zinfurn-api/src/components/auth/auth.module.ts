import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google.strategy';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegramStrategy } from './telegram.strategy';
import MemberSchema from '../../schemas/Member.model';

@Module({
  imports: [
    HttpModule,
    PassportModule,
    MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
    JwtModule.register({
      secret: `${process.env.SECRET_TOKEN}`,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  providers: [AuthService, GoogleStrategy, TelegramStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}