import { Field, ObjectType, Int } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { Member, TotalCounter } from '../member/member';
import { MeLiked } from '../like/like';
import { RepairPropertyStatus, RepairPropertyType } from '../../enums/repairProperty.enum';

@ObjectType()
export class RepairI18n {
    @Field(() => String, { nullable: true })
    title?: string;

    @Field(() => String, { nullable: true })
    desc?: string;
}

@ObjectType()
export class RepairTranslations {
    @Field(() => RepairI18n, { nullable: true })
    uz?: RepairI18n;

    @Field(() => RepairI18n, { nullable: true })
    en?: RepairI18n;

    @Field(() => RepairI18n, { nullable: true })
    ru?: RepairI18n;

    @Field(() => RepairI18n, { nullable: true })
    kr?: RepairI18n;

    @Field(() => RepairI18n, { nullable: true })
    ar?: RepairI18n;
}

@ObjectType()
export class RepairProperty {
    @Field(() => String)
    _id: ObjectId;

    @Field(() => RepairPropertyType)
    repairPropertyType: RepairPropertyType;

    @Field(() => RepairPropertyStatus, { nullable: true })
    repairPropertyStatus?: RepairPropertyStatus;

    @Field(() => String)
    repairPropertyAddress: string;

    @Field(() => String)
    repairPropertyDescription: string;

    @Field(() => [String], { nullable: true })
    repairPropertyImages?: string[];

    @Field(() => RepairTranslations, { nullable: true })
    repairPropertyTranslations?: RepairTranslations;

    @Field(() => Int)
    repairPropertyViews: number;

    @Field(() => Int)
    repairPropertyLikes: number;

    @Field(() => Int)
    repairPropertyComments: number;

    @Field(() => String)
    memberId: ObjectId;

    @Field(() => Date, { nullable: true })
    deletedAt?: Date;

    @Field(() => Date, { nullable: true })
    constructedAt?: Date;

    @Field(() => Date, { nullable: true })
    createdAt?: Date;

    // from aggregation /

    @Field(() => [MeLiked], { nullable: true })
    meLiked?: MeLiked[];

    @Field(() => Member, { nullable: true })
    memberData?: Member
}

@ObjectType()
export class RepairProperties {
    @Field(() => [RepairProperty])
    list: RepairProperty[];

    @Field(() => [TotalCounter], { nullable: true })
    metaCounter?: TotalCounter[];
}
