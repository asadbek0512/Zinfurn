import { Injectable } from '@nestjs/common';

@Injectable()
export class ZinfurnBatchService {
  getHello(): string {
    return 'Welcome to Zinfurn BATCH Server!';
  }
}
