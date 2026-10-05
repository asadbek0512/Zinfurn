import { BadRequestException, CanActivate, ExecutionContext, Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { Message } from 'apps/zinfurn-api/src/libs/enums/common_enum';
import { SecurityAlertService, SecurityEventType } from '../../security/security-alert.service';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private authService: AuthService,
		private alert: SecurityAlertService,
	) {}

	async canActivate(context: ExecutionContext | any): Promise<boolean> {
		const roles = this.reflector.get<string[]>('roles', context.getHandler());
		if (!roles) return true;

		Logger.log(`--- @guard() Authentication [RolesGuard]: ${roles} ---`);

		if (context.contextType === 'graphql') {
			const request = context.getArgByIndex(2).req;
			const meta = this.reqMeta(request);
			const bearerToken = request.headers.authorization;
			if (!bearerToken) throw new BadRequestException(Message.TOKEN_NOT_EXIST);

			let authMember: any;
			try {
				authMember = await this.authService.verifyToken(bearerToken.split(' ')[1]);
			} catch (err) {
				// Yaroqsiz token bilan admin endpoint'ga urinish — brute-force signali
				this.alert.noteAuthFailure(meta.ip, `admin endpoint'ga yaroqsiz token (roles: ${roles})`, meta.path, meta.ua);
				throw err;
			}

			const hasPermission = roles.indexOf(authMember.memberType) > -1;
			if (!authMember || !hasPermission) {
				this.alert.report({
					type: SecurityEventType.UNAUTHORIZED_ADMIN,
					detail: `'${authMember?.memberType}' roli '${roles}' talab qilinadigan endpoint'ga urindi`,
					ip: meta.ip,
					path: meta.path,
					userAgent: meta.ua,
					memberId: authMember?._id ? String(authMember._id) : undefined,
				});
				throw new ForbiddenException(Message.ONLY_SPECIFIC_ROLES_ALLOWED);
			}

			request.body.authMember = authMember;
			return true;
		}

		return false;
		// description => http, rpc, gprs and etc are ignored
	}

	private reqMeta(request: any): { ip: string; path: string; ua: string } {
		const xff = request?.headers?.['x-forwarded-for'];
		const ip = (typeof xff === 'string' && xff.split(',')[0].trim()) || request?.ip || 'unknown';
		return { ip, path: request?.originalUrl || request?.url || 'graphql', ua: String(request?.headers?.['user-agent'] || '') };
	}
}
