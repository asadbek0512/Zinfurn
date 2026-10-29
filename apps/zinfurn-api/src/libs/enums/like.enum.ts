import { registerEnumType } from '@nestjs/graphql';

export enum LikeGroup {
	MEMBER = 'MEMBER',
	PRODUCT = 'PRODUCT',
	ARTICLE = 'ARTICLE',
	REPAIR_PRODUCT = 'REPAIR_PRODUCT',
}
registerEnumType(LikeGroup, {
	name: 'LikeGroup',
});
