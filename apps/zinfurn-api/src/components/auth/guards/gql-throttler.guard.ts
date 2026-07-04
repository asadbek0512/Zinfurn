import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * GraphQL bilan ishlaydigan rate-limit guard.
 * HTTP (REST/OAuth) so'rovlar odatdagidek, GraphQL kontekstdan req/res olinadi,
 * WebSocket va req'siz kontekstlar chetlab o'tiladi (ular uchun throttling ma'nosiz).
 */
@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
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
}
