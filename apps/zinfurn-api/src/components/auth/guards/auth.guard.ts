import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Message } from 'apps/zinfurn-api/src/libs/enums/common_enum';

function parseCookieToken(cookieHeader: string | undefined): string | null {
	if (!cookieHeader) return null;
	for (const part of cookieHeader.split(';')) {
		const [key, ...rest] = part.trim().split('=');
		if (key?.trim() === 'accessToken') return decodeURIComponent(rest.join('='));
	}
	return null;
}

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private authService: AuthService) { }

	async canActivate(context: ExecutionContext | any): Promise<boolean> {
		Logger.log('--- @guard() Authentication [AuthGuard] ---');

		if (context.contextType === 'graphql') {
			const request = context.getArgByIndex(2).req;

			const cookieToken = parseCookieToken(request.headers.cookie);
			const bearerToken = request.headers.authorization;
			const rawToken = cookieToken || (bearerToken ? bearerToken.split(' ')[1] : null);

			if (!rawToken) throw new BadRequestException(Message.TOKEN_NOT_EXIST);
			const authMember = await this.authService.verifyToken(rawToken);
			if (!authMember) throw new UnauthorizedException(Message.NOT_AUTHENTICATED);

			request.body.authMember = authMember;

			return true;
		}

		return false; // ?????????????


		// description => http, rpc, gprs and etc are ignored
	}
}
