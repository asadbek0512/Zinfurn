import { ExecutionContext, Injectable, Inject, Optional } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';
import { GqlExecutionContext } from '@nestjs/graphql';
import { SecurityAlertService, SecurityEventType } from '../../security/security-alert.service';

/**
 * GraphQL bilan ishlaydigan rate-limit guard.
 * HTTP (REST/OAuth) so'rovlar odatdagidek, GraphQL kontekstdan req/res olinadi,
 * WebSocket va req'siz kontekstlar chetlab o'tiladi (ular uchun throttling ma'nosiz).
 */
@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
	// Property injection — ThrottlerGuard konstruktorini qayta yozmaslik uchun.
	@Optional() @Inject(SecurityAlertService) private readonly alert?: SecurityAlertService;

	getRequestResponse(context: ExecutionContext) {
		if (context.getType<string>() === 'graphql') {
			const gqlCtx = GqlExecutionContext.create(context).getContext();
			return { req: gqlCtx.req, res: gqlCtx.res ?? gqlCtx.req?.res };
		}
		const http = context.switchToHttp();
		return { req: http.getRequest(), res: http.getResponse() };
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		if (context.getType<string>() === 'ws') return true;
		const { req, res } = this.getRequestResponse(context);
		if (!req || !res) return true;
		return super.canActivate(context);
	}

	// Limit oshganda admin'ga alert (ThrottlerGuard bu metodni limit buzilganda chaqiradi).
	protected async throwThrottlingException(context: ExecutionContext, throttlerLimitDetail: any): Promise<void> {
		try {
			const { req } = this.getRequestResponse(context);
			const xff = req?.headers?.['x-forwarded-for'];
			this.alert?.report({
				type: SecurityEventType.RATE_LIMIT,
				detail: 'So\'rov chastotasi limitdan oshdi (DoS/scraping ehtimoli)',
				ip: (typeof xff === 'string' && xff.split(',')[0].trim()) || req?.ip || 'unknown',
				path: req?.originalUrl || 'graphql',
				userAgent: String(req?.headers?.['user-agent'] || ''),
			});
		} catch {
			/* alert hech qachon so'rov oqimini buzmasin */
		}
		throw new ThrottlerException();
	}
}
