import { Module, Logger } from '@nestjs/common';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: () => ({
                uri: process.env.NODE_ENV === "production" ? process.env.MONGO_PROD : process.env.MONGO_DEV,
            }),
        }),
    ],
    exports: [MongooseModule],
})
export class DatabaseModule { 
    constructor(@InjectConnection() private readonly connection: Connection) {
        const logger = new Logger('Database');
        if (connection.readyState === 1) {
            logger.log(
                `MongoDB connected (${process.env.NODE_ENV === 'production' ? 'production' : 'development'})`,
            );
        } else {
            logger.error('DB is not connected!');
        }
    }
}
