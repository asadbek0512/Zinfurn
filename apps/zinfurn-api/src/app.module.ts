import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { ComponentsModule } from './components/components.module';
import { DatabaseModule } from './database/database.module';
import { T } from './libs/types/common';
import { SocketModule } from './socket/socket.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { GqlThrottlerGuard } from './components/auth/guards/gql-throttler.guard';
import * as depthLimit from 'graphql-depth-limit';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // Rate limiting: umumiy 300 so'rov/daqiqa (login/signup/refresh'da qattiqroq — @Throttle bilan)
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60000, limit: 300 }]),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: process.env.NODE_ENV !== 'production',
      introspection: process.env.NODE_ENV !== 'production',
      uploads: false,
      autoSchemaFile: true,
      // Chuqur nested query bilan DoS'ning oldini olish
      validationRules: [depthLimit(8)],
      context: ({ req, res }: { req: any; res: any }) => ({ req, res }),
      formatError: (error: T) => { //confeguratsiya #graphql da sodirbo'lgan errorni olin neradi
        const graphQLFormattedError = {
          code: error?.extensions.code,
          message:
            error?.extensions?.exception?.response?.message || error?.extensions?.response?.message || error?.message,
        };
        Logger.error("GRAPHQL GLOBAL ERR:", graphQLFormattedError);
        return graphQLFormattedError;
      },
    }),
    ComponentsModule,// bu modul boshqa modullar bilan bog'lovchi ko'prik hisoblanadi.
    DatabaseModule, SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver, { provide: APP_GUARD, useClass: GqlThrottlerGuard }],
})
export class AppModule { }
//loyihasining markaziy moduli hisblangan AppModule ni tashkil qilib, barcha kerakli qismlarni bir joyga birlashtiramiz.
