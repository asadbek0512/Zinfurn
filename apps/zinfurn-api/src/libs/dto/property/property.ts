import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ObjectId } from "mongoose";
import { PropertyCategory, PropertyColor, PropertyCondition, PropertyMaterial, PropertyStatus, PropertyType } from "../../enums/property.enum";
import { Member, TotalCounter } from "../member/member";
import { MeLiked } from "../like/like";

@ObjectType()
export class Property {
    @Field(() => String)
    _id: ObjectId;

    @Field(() => PropertyType)
    propertyType: PropertyType;

    @Field(() => PropertyStatus, { nullable: true })
    propertyStatus?: PropertyStatus;

    @Field(() => PropertyCategory)
    propertyCategory: PropertyCategory;

    @Field(() => PropertyMaterial)
    propertyMaterial: PropertyMaterial;

    @Field(() => PropertyColor)
    propertyColor: PropertyColor;

    @Field(() => String)
    propertySize: string;

    @Field(() => String)
    propertyTitle: string;

    @Field(() => Number)
    propertyPrice: number;

    @Field(() => Number, { nullable: true })
    propertySalePrice?: number;

    @Field(() => Boolean, { nullable: true })
    propertyIsOnSale?: boolean;

    @Field(() => Date, { nullable: true })
    propertySaleExpiresAt?: Date;

    @Field(() => [String], { nullable: true })
    propertyImages?: string[];

    @Field(() => String, { nullable: true })
    propertyDesc?: string;

    @Field(() => Boolean, { nullable: true })
    propertyBarter?: boolean;

    @Field(() => Boolean, { nullable: true })
    propertyRent?: boolean;

    @Field(() => Boolean, { nullable: true })
    propertyInStock?: boolean;

    @Field(() => PropertyCondition)
    propertyCondition: PropertyCondition;

    @Field(() => String, { nullable: true })
    propertyBrand?: string;

    @Field(() => String, { nullable: true })
    propertyOriginCountry?: string;

    @Field(() => String, { nullable: true })
    propertyAddress?: string;

    @Field(() => Int )
    propertyViews: number;

    @Field(() => Int, { nullable: true })
    propertyLikes?: number;

    @Field(() => Int, { nullable: true })
    propertyComments?: number;

    @Field(() => Int, { nullable: true })
    propertyRank?: number;

    @Field(() => String)
    memberId: ObjectId;

    @Field(() => Date, { nullable: true })
    soldAt?: Date;

    @Field(() => Date, { nullable: true })
    deletedAt?: Date;

    @Field(() => Date, { nullable: true })
    constructedAt?: Date;

    @Field(() => Date, { nullable: true })
    createdAt?: Date;

    @Field(() => Date, { nullable: true })
    updatedAt?: Date;

    // from aggregation /

    @Field(() => [MeLiked], { nullable: true })
    meLiked?: MeLiked[];

    @Field(() => Member, { nullable: true })
    memberData?: Member
}



@ObjectType()
export class Properties {
    @Field(() => [Property])
    list: Property[];

    @Field(() => [TotalCounter], { nullable: true })
    metaCounter: TotalCounter[];
}
