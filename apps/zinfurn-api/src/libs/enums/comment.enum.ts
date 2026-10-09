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
	PROPERTY = 'PROPERTY',
	PROPERTY_QA = 'PROPERTY_QA',
	REPAIR_PROPERTY = 'REPAIR_PROPERTY',
}
registerEnumType(CommentGroup, {
	name: 'CommentGroup',
});
