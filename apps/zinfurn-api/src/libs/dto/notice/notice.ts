import { Field, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';

@ObjectType()
export class NoticeI18n {
	@Field(() => String, { nullable: true })
	title?: string;

	@Field(() => String, { nullable: true })
	desc?: string;
}

@ObjectType()
export class NoticeTranslations {
	@Field(() => NoticeI18n, { nullable: true })
	uz?: NoticeI18n;

	@Field(() => NoticeI18n, { nullable: true })
	en?: NoticeI18n;

	@Field(() => NoticeI18n, { nullable: true })
	ru?: NoticeI18n;

	@Field(() => NoticeI18n, { nullable: true })
	kr?: NoticeI18n;

	@Field(() => NoticeI18n, { nullable: true })
	ar?: NoticeI18n;
}

@ObjectType()
export class Notice {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => NoticeCategory)
	noticeCategory: NoticeCategory;

	@Field(() => NoticeStatus)
	noticeStatus: NoticeStatus;

	@Field(() => String)
	noticeTitle: string;

	@Field(() => String)
	noticeContent: string;

	@Field(() => NoticeTranslations, { nullable: true })
	noticeTranslations?: NoticeTranslations;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}

@ObjectType()
export class Notices {
	@Field(() => [Notice])
	list: Notice[];

	@Field(() => [NoticesMeta], { nullable: true })
	metaCounter: NoticesMeta[];
}

@ObjectType()
export class NoticesMeta {
	@Field(() => String)
	_id: string;

	@Field(() => Number)
	count: number;
}