import { registerEnumType } from '@nestjs/graphql';

export enum ReportGroup {
	ARTICLE = 'ARTICLE',
	COMMENT = 'COMMENT',
	MEMBER = 'MEMBER',
	PROPERTY = 'PROPERTY',
	MESSAGE = 'MESSAGE',
}
registerEnumType(ReportGroup, { name: 'ReportGroup' });

export enum ReportReason {
	SPAM = 'SPAM',
	ABUSE = 'ABUSE',
	INAPPROPRIATE = 'INAPPROPRIATE',
	FRAUD = 'FRAUD',
	OTHER = 'OTHER',
}
registerEnumType(ReportReason, { name: 'ReportReason' });

export enum ReportStatus {
	PENDING = 'PENDING',
	RESOLVED = 'RESOLVED',
}
registerEnumType(ReportStatus, { name: 'ReportStatus' });
