import { registerEnumType } from '@nestjs/graphql';

export enum ViewGroup {
	MEMBER = 'MEMBER',
	ARTICLE = 'ARTICLE',
	PROPERTY = 'PROPERTY',
	REPAIRPROPERTY = 'REPAIRPROPERTY',
}
registerEnumType(ViewGroup, {
	name: 'ViewGroup',
});
