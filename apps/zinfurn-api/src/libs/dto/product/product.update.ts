import { Field, InputType, Int } from "@nestjs/graphql";
import { IsInt, IsNotEmpty, IsOptional, Length, MinLength, Min } from "class-validator";
import { ObjectId } from "mongoose";
import { ProductCategory, ProductColor, ProductCondition, ProductMaterial, ProductStatus, ProductType } from "../../enums/product.enum";

@InputType()
export class ProductUpdate {
  @IsNotEmpty()
  @Field(() => String)
  _id: ObjectId;

  @IsOptional()
  @Field(() => ProductType, { nullable: true })
  productType?: ProductType;

  @IsOptional()
  @Field(() => ProductStatus, { nullable: true })
  productStatus?: ProductStatus;

  @IsOptional()
  @Field(() => ProductCategory, { nullable: true })
  productCategory?: ProductCategory;

  @IsOptional()
  @Field(() => ProductMaterial, { nullable: true })
  productMaterial?: ProductMaterial;

  @IsOptional()
  @Field(() => ProductColor, { nullable: true })
  productColor?: ProductColor;

  @IsOptional()
  @Field(() => String, { nullable: true })
  productSize?: string;

  @IsOptional()
  @Length(3, 100)
  @Field(() => String, { nullable: true })
  productTitle?: string;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  productPrice?: number;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  productSalePrice?: number;

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  productIsOnSale?: boolean;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  productStock?: number;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  productSaleStartsAt?: Date;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  productSaleExpiresAt?: Date;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  productImages?: string[];

  @IsOptional()
  @Field(() => String, { nullable: true })
  productArModel?: string;

  @IsOptional()
  @MinLength(5)
  @Field(() => String, { nullable: true })
  productDesc?: string;

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  productBarter?: boolean;

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  productRent?: boolean;

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  productInStock?: boolean;

  @IsOptional()
  @Field(() => ProductCondition, { nullable: true })
  productCondition?: ProductCondition;

  @IsOptional()
  @Field(() => String, { nullable: true })
  productBrand?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  productOriginCountry?: string;


  soldAt?: Date;

  deletedAt?: Date;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  constructedAt?: Date;

}
