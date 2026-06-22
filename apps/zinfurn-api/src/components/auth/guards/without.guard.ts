import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

function parseCookieToken(cookieHeader: string | undefined): string | null {
	if (!cookieHeader) return null;
	for (const part of cookieHeader.split(';')) {
		const [key, ...rest] = part.trim().split('=');
		if (key?.trim() === 'accessToken') return decodeURIComponent(rest.join('='));
	}
	return null;
}

@Injectable()
export class WithoutGuard implements CanActivate {
	constructor(private authService: AuthService) {}

	async canActivate(context: ExecutionContext | any): Promise<boolean> {
		console.info('--- @guard() Authentication [WithoutGuard] ---');

		if (context.contextType === 'graphql') {
			const request = context.getArgByIndex(2).req;
			const cookieToken = parseCookieToken(request.headers.cookie);
			const bearerToken = request.headers.authorization;
			const rawToken = cookieToken || (bearerToken ? bearerToken.split(' ')[1] : null);

			if (rawToken) {
				try {
					const authMember = await this.authService.verifyToken(rawToken);
					request.body.authMember = authMember;
				} catch (err) {
					request.body.authMember = null;
				}
			} else request.body.authMember = null;

			return true;
		}
		return false;
	}
}
