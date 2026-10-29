import { Field, ObjectType, Int } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { Member, TotalCounter } from '../member/member';
import { MeLiked } from '../like/like';
import { RepairProductStatus, RepairProductType } from '../../enums/repairProduct.enum';

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
export class RepairProduct {
    @Field(() => String)
    _id: ObjectId;

    @Field(() => RepairProductType)
    repairProductType: RepairProductType;

    @Field(() => RepairProductStatus, { nullable: true })
    repairProductStatus?: RepairProductStatus;

    @Field(() => String)
    repairProductAddress: string;

    @Field(() => String)
    repairProductDescription: string;

    @Field(() => [String], { nullable: true })
    repairProductImages?: string[];

    @Field(() => RepairTranslations, { nullable: true })
    repairProductTranslations?: RepairTranslations;

    @Field(() => Int)
    repairProductViews: number;

    @Field(() => Int)
    repairProductLikes: number;

    @Field(() => Int)
    repairProductComments: number;

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
export class RepairProducts {
    @Field(() => [RepairProduct])
    list: RepairProduct[];

    @Field(() => [TotalCounter], { nullable: true })
    metaCounter?: TotalCounter[];
}
