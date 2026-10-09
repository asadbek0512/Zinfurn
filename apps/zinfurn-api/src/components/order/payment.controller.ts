import { Body, Controller, Headers, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PaymeRequest, PaymeResponse, PaymeService } from './payme.service';
import { ClickRequest, ClickResponse, ClickService } from './click.service';

/**
 * Provayderlar server-server chaqiradigan endpoint'lar. JWT yo'q — Payme Basic auth,
 * Click md5 imzo bilan tekshiriladi. Ikkalasi ham doim HTTP 200 kutadi (xato body ichida).
 */
@Controller()
export class PaymentController {
	constructor(
		private readonly paymeService: PaymeService,
		private readonly clickService: ClickService,
	) {}

	@Post('payme')
	@HttpCode(HttpStatus.OK)
	public payme(@Body() body: PaymeRequest, @Headers('authorization') auth: string | undefined): Promise<PaymeResponse> {
		return this.paymeService.handle(body, auth);
	}

	@Post('click/prepare')
	@HttpCode(HttpStatus.OK)
	public clickPrepare(@Body() body: ClickRequest): Promise<ClickResponse> {
		return this.clickService.prepare(body);
	}

	@Post('click/complete')
	@HttpCode(HttpStatus.OK)
	public clickComplete(@Body() body: ClickRequest): Promise<ClickResponse> {
		return this.clickService.complete(body);
	}
}
