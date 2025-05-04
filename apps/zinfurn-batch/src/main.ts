import { NestFactory } from '@nestjs/core';
import { ZinfurnBatchModule } from './zinfurn-batch.module';

async function bootstrap() {
  const app = await NestFactory.create(ZinfurnBatchModule);
  await app.listen(process.env.PORT_BATCH ?? 3000);
}
bootstrap();
