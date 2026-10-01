import { registerEnumType } from '@nestjs/graphql';

export enum PushPlatform {
	IOS = 'IOS',
	ANDROID = 'ANDROID',
}
registerEnumType(PushPlatform, { name: 'PushPlatform' });
