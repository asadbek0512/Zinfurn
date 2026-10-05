import { Global, Module } from '@nestjs/common';
import { SecurityAlertService } from './security-alert.service';

/**
 * Global modul — SecurityAlertService hamma joyda (guard'lar, resolver'lar, middleware)
 * qo'shimcha import'siz inject qilinadi.
 */
@Global()
@Module({
	providers: [SecurityAlertService],
	exports: [SecurityAlertService],
})
export class SecurityModule {}
