import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: true, // konfiguratsiyalari
      uploads: false,
      autoSchemaFile: true,
      formatError: (error: T) => { //confeguratsiya #graphql da sodirbo'lgan errorni olin neradi
        const graphQLFormattedError = {
          code: error?.extensions.code,
          message:
            error?.extensions?.exception?.response?.message || error?.extensions?.response?.message || error?.message,
        };
        console.log("GRAPHQL GLOBAL ERR:", graphQLFormattedError);
        return graphQLFormattedError;
      },
    }),
    ComponentsModule,// bu modul boshqa modullar bilan bog'lovchi ko'prik hisoblanadi.
    DatabaseModule, SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule { }
//loyihasining markaziy moduli hisblangan AppModule ni tashkil qilib, barcha kerakli qismlarni bir joyga birlashtiramiz.
