import { registerEnumType } from '@nestjs/graphql';

export enum CommentStatus {
	ACTIVE = 'ACTIVE',
	DELETE = 'DELETE',
}
registerEnumType(CommentStatus, {
	name: 'CommentStatus',
});

export enum CommentGroup {
	MEMBER = 'MEMBER',
	ARTICLE = 'ARTICLE',
	PRODUCT = 'PRODUCT',
	PRODUCT_QA = 'PRODUCT_QA',
	REPAIR_PRODUCT = 'REPAIR_PRODUCT',
}
registerEnumType(CommentGroup, {
	name: 'CommentGroup',
});
