import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './libs/interceptor/Logging.interceptor';
import { graphqlUploadExpress } from 'graphql-upload';
import helmet from 'helmet';
import * as express from 'express';
import * as session from 'express-session';
import { WsAdapter } from '@nestjs/platform-ws';
import { randomBytes } from 'crypto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Nginx orqasidamiz — req.ip haqiqiy client IP bo'lishi uchun (rate-limit va secure cookie'ga zarur)
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  // Xavfsizlik headerlari (HSTS, X-Frame-Options, nosniff, ...).
  // - contentSecurityPolicy: false — bu GraphQL/JSON API, CSP frontend tomonida; Apollo sandbox'ni buzmaslik uchun
  // - crossOriginResourcePolicy: 'cross-origin' — frontend /uploads rasmlarini boshqa origin'dan yuklay olishi uchun
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginEmbedderPolicy: false,
    }),
  );

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingInterceptor());
  const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3006').split(',').map(o => o.trim());
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });

  app.use(graphqlUploadExpress({ maxFileSize: 15000000, maxFiles: 10 }))
  app.use('/uploads', express.static('./uploads'));

  // Session for OAuth state management
  // OAuth state session: secret env'dan; yo'q bo'lsa tasodifiy (restart'da eski sessionlar bekor — OAuth 60s oqim uchun muammo emas)
  app.use(session({
    secret: process.env.SESSION_SECRET || randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 10 * 60 * 1000,
    },
  }));

  app.useWebSocketAdapter(new WsAdapter(app))
  await app.listen(process.env.PORT_API ?? 3000);
}
bootstrap();
