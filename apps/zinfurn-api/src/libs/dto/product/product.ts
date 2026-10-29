import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { ObjectId } from "mongoose";
import { ProductCategory, ProductColor, ProductCondition, ProductMaterial, ProductStatus, ProductType } from "../../enums/product.enum";
import { Member, TotalCounter } from "../member/member";
import { MeLiked } from "../like/like";

@ObjectType()
export class ProductI18n {
    @Field(() => String, { nullable: true })
    title?: string;

    @Field(() => String, { nullable: true })
    desc?: string;
}

@ObjectType()
export class ProductTranslations {
    @Field(() => ProductI18n, { nullable: true })
    uz?: ProductI18n;

    @Field(() => ProductI18n, { nullable: true })
    en?: ProductI18n;

    @Field(() => ProductI18n, { nullable: true })
    ru?: ProductI18n;

    @Field(() => ProductI18n, { nullable: true })
    kr?: ProductI18n;

    @Field(() => ProductI18n, { nullable: true })
    ar?: ProductI18n;
}

@ObjectType()
export class Product {
    @Field(() => String)
    _id: ObjectId;

    @Field(() => ProductType)
    productType: ProductType;

    @Field(() => ProductStatus, { nullable: true })
    productStatus?: ProductStatus;

    @Field(() => ProductCategory)
    productCategory: ProductCategory;

    @Field(() => ProductMaterial)
    productMaterial: ProductMaterial;

    @Field(() => ProductColor)
    productColor: ProductColor;

    @Field(() => String)
    productSize: string;

    @Field(() => String)
    productTitle: string;

    @Field(() => Number)
    productPrice: number;

    @Field(() => Number, { nullable: true })
    productSalePrice?: number;

    @Field(() => Boolean, { nullable: true })
    productIsOnSale?: boolean;

    @Field(() => Number, { nullable: true })
    productStock?: number;

    @Field(() => Date, { nullable: true })
    productSaleStartsAt?: Date;

    @Field(() => Date, { nullable: true })
    productSaleExpiresAt?: Date;

    @Field(() => [String], { nullable: true })
    productImages?: string[];

    @Field(() => String, { nullable: true })
    productArModel?: string;

    @Field(() => String, { nullable: true })
    productDesc?: string;

    @Field(() => ProductTranslations, { nullable: true })
    productTranslations?: ProductTranslations;

    @Field(() => Boolean, { nullable: true })
    productBarter?: boolean;

    @Field(() => Boolean, { nullable: true })
    productRent?: boolean;

    @Field(() => Boolean, { nullable: true })
    productInStock?: boolean;

    @Field(() => ProductCondition)
    productCondition: ProductCondition;

    @Field(() => String, { nullable: true })
    productBrand?: string;

    @Field(() => String, { nullable: true })
    productOriginCountry?: string;

    @Field(() => String, { nullable: true })
    productAddress?: string;

    @Field(() => Int )
    productViews: number;

    @Field(() => Int, { nullable: true })
    productLikes?: number;

    @Field(() => Int, { nullable: true })
    productReviews?: number;

    @Field(() => Float, { nullable: true })
    productRating?: number;

    @Field(() => Int, { nullable: true })
    productSoldCount?: number;

    @Field(() => Int, { nullable: true })
    productRank?: number;

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
export class Products {
    @Field(() => [Product])
    list: Product[];

    @Field(() => [TotalCounter], { nullable: true })
    metaCounter: TotalCounter[];
}
