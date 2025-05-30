import { registerEnumType } from '@nestjs/graphql';

export enum LikeGroup {
	MEMBER = 'MEMBER',
	PROPERTY = 'PROPERTY',
	ARTICLE = 'ARTICLE',
	REPAIR_PROPERTY = 'REPAIR_PROPERTY',
}
registerEnumType(LikeGroup, {
	name: 'LikeGroup',
});
