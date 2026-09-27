import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AppStatService } from './app-stat.service';
import { AppStat } from '../../libs/dto/app-stat/app-stat';
import { AppPlatform } from '../../libs/enums/app-stat.enum';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';

@Resolver()
export class AppStatResolver {
	constructor(private readonly appStatService: AppStatService) {}

	/** Ochiq — mehmon ham yuklab olishi mumkin */
	@Mutation(() => Boolean)
	public async recordAppDownload(
		@Args('platform', { type: () => AppPlatform }) platform: AppPlatform,
	): Promise<boolean> {
		return await this.appStatService.recordAppDownload(platform);
	}

	@UseGuards(AuthGuard, RolesGuard)
	@Roles(MemberType.ADMIN)
	@Query(() => [AppStat])
	public async getAppStats(): Promise<AppStat[]> {
		return await this.appStatService.getAppStats();
	}
}
