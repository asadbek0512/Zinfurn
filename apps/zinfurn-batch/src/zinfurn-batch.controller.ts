import { Controller, Get } from '@nestjs/common';
import { ZinfurnBatchService } from './zinfurn-batch.service';

@Controller()
export class ZinfurnBatchController {
  constructor(private readonly zinfurnBatchService: ZinfurnBatchService) {}

  @Get()
  getHello(): string {
    return this.zinfurnBatchService.getHello();
  }
}
