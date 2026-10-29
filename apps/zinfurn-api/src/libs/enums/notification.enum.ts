import { registerEnumType } from '@nestjs/graphql';

export enum NotificationType {
	LIKE = 'LIKE',
	COMMENT = 'COMMENT',
	MESSAGE = 'MESSAGE',
	PRICE_DROP = 'PRICE_DROP',
}
registerEnumType(NotificationType, {
	name: 'NotificationType',
});

export enum NotificationStatus {
	WAIT = 'WAIT',
	READ = 'READ',
}
registerEnumType(NotificationStatus, {
	name: 'NotificationStatus',
});

export enum NotificationGroup {
	MEMBER = 'MEMBER',
	ARTICLE = 'ARTICLE',
	PRODUCT = 'PRODUCT',
	REPAIR_PRODUCT = 'REPAIR_PRODUCT',

}
registerEnumType(NotificationGroup, {
	name: 'NotificationGroup',
});
