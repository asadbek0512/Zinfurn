import { Field, HideField, Int, ObjectType } from "@nestjs/graphql";
import { ObjectId } from "mongoose";
import { MemberAuthType, MemberStatus, MemberType } from "../../enums/member.enum";
import { MeLiked } from "../like/like";
import { MeFollowed } from "../follow/follow";


//DTO
@ObjectType()
export class Member {
    @Field(() => String)
    _id: ObjectId;

    @Field(() => MemberType)
    memberType: MemberType;

    @Field(() => MemberStatus)
    memberStatus: MemberStatus;

    @Field(() => MemberAuthType)
    memberAuthType: MemberAuthType;

    @Field(() => String) //for graphql, js
    memberPhone: string; //static ts type

    @Field(() => String)
    memberNick: string;

    memberPassword?: string;

    @Field(() => String, { nullable: true })
    memberFullName?: string;

    @Field(() => String, { nullable: true })
    memberImage: string;

    @Field(() => String, { nullable: true })
    memberAddress?: string;

    @Field(() => String, { nullable: true })
    memberDesc?: string;

    @Field(() => Int)
    memberProperties: number;

    @Field(() => Int)
    memberArticles: number;

    @Field(() => Int)
    memberFollowers: number;

    @Field(() => String, { nullable: true })
    memberEmail?: string;

    @Field(() => Int)
    memberFollowings: number;

    @Field(() => Int)
    memberPoints: number;

    @Field(() => Int)
    memberLikes: number;

    @Field(() => Int)
    memberViews: number;

    @Field(() => Int)
    memberComments: number;

    @Field(() => Int)
    memberRank: number;

    @Field(() => Int)
    memberWarnings: number;

    @Field(() => Int)
    memberBlocks: number;

    @Field(() => Date, { nullable: true })
    deletedAt?: Date;

    @Field(() => Date, { nullable: true })
    createdAt: Date;

    @Field(() => Date, { nullable: true })
    updatedAt: Date;

    @Field(() => String, { nullable: true })
    accessToken?: string;

    /** from aggregation **/
    @Field(() => [MeLiked], { nullable: true })
    meLiked?: MeLiked[];

    @Field(() => [MeFollowed], { nullable: true })
    meFollowed?: MeFollowed[];
}

@ObjectType()
export class TotalCounter {
    @Field(() => Int, { nullable: true })
    total: number;
}

@ObjectType()
export class Members {
    @Field(() => [Member])
    list: Member[];

    @Field(() => [TotalCounter], { nullable: true })
    metaCounter: TotalCounter[];
}