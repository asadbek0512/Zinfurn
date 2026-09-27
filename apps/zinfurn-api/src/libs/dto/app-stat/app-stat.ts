import { Field, Int, ObjectType } from '@nestjs/graphql';
import { AppPlatform } from '../../enums/app-stat.enum';

@ObjectType()
export class AppStat {
	@Field(() => AppPlatform)
	platform: AppPlatform;

	@Field(() => Int)
	downloads: number;

	@Field(() => Date, { nullable: true })
	updatedAt?: Date;
}
