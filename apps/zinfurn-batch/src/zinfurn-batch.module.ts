import { Module } from '@nestjs/common';
import { ZinfurnBatchController } from './zinfurn-batch.controller';
import { ZinfurnBatchService } from './zinfurn-batch.service';
import { ConfigModule } from "@nestjs/config"

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ZinfurnBatchController],
  providers: [ZinfurnBatchService],
})
export class ZinfurnBatchModule { }
