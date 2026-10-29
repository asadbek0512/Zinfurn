import { registerEnumType } from '@nestjs/graphql';

export enum ViewGroup {
	MEMBER = 'MEMBER',
	ARTICLE = 'ARTICLE',
	PRODUCT = 'PRODUCT',
	REPAIR_PRODUCT = 'REPAIR_PRODUCT',
}
registerEnumType(ViewGroup, {
	name: 'ViewGroup',
});
