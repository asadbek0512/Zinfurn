import { registerEnumType } from '@nestjs/graphql';

export enum AppPlatform {
	ANDROID = 'ANDROID',
	IOS = 'IOS',
}
registerEnumType(AppPlatform, {
	name: 'AppPlatform',
});
