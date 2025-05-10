import { registerEnumType } from '@nestjs/graphql';

export enum LikeGroup {
	MEMBER = 'MEMBER',
	PROPERTY = 'PROPERTY',
	ARTICLE = 'ARTICLE',
	REPAIRPROPERTY = 'REPAIRPROPERTY',
}
registerEnumType(LikeGroup, {
	name: 'LikeGroup',
});
