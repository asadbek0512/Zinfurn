import { Controller, Get, Logger } from '@nestjs/common';
import { BatchService as BatchService } from './batch.service';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { BATCH_FLASH_SALES, BATCH_ROLLBACK, BATCH_TOP_AGENTS, BATCH_TOP_PROPERTIES } from './lib/config';

const FLASH_SALES_STARTUP_DELAY_MS = 5000;

@Controller()
export class BatchController {
  private logger: Logger = new Logger('BatchController');

  constructor(private readonly BatchService: BatchService) { }

  @Timeout(1000)
  handleTimeout() {
    this.logger.debug('BATCH SERVER READY!');
  }

  // Deploy / restart'dan keyin kutmasdan ishlaydi
  @Timeout(FLASH_SALES_STARTUP_DELAY_MS)
  public async batchFlashSalesOnStart() {
    await this.batchFlashSales();
  }

  // Har soat: tugagan aksiya o'rniga ko'pi bilan 1 soatda yangisi chiqadi
  @Cron(`00 05 * * * *`, { name: BATCH_FLASH_SALES })
  public async batchFlashSales() {
    try {
      await this.BatchService.batchFlashSales();
    } catch (err) {
      this.logger.error(err);
    }
  }

  @Cron(`00 00 01 * * *`, { name: BATCH_ROLLBACK })
  public async batchRollback() {
    try{
      this.logger['context'] = BATCH_ROLLBACK ;
      this.logger.debug('EXECUTED!');
      await this.BatchService.batchRollback()
    } catch (err) {
      this.logger.error(err)
    }
  }

  @Cron(`20 00 01 * * *`, { name: BATCH_TOP_PROPERTIES })
  public async batchTopProperties() {
    try{
      this.logger['context'] = BATCH_TOP_PROPERTIES ;
      this.logger.debug('EXECUTED!');
      await this.BatchService.batchTopProperties()
    } catch (err) {
      this.logger.error(err)
    }
  }

  @Cron(`40 00 01 * * *`, { name: BATCH_TOP_AGENTS })
  public async batchTopAgents() {
    try{
      this.logger['context'] = BATCH_TOP_AGENTS ;
      this.logger.debug('EXECUTED!');
      await this.BatchService.batchTopAgents()
    } catch (err) {
      this.logger.error(err)
    }
  }

/*
  @Interval(1000)
  handleInterval() {
    this.logger.debug('INTERVAL TEST');
  }
*/

  @Get()
  public getHello(): string {
    return this.BatchService.getHello();
  }
}
