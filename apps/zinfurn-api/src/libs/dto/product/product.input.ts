import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length, MinLength, Min, IsInt, IsIn, IsMongoId, ArrayMaxSize } from 'class-validator';
import { ProductType, ProductStatus, ProductCategory, ProductMaterial, ProductColor, ProductCondition } from '../../enums/product.enum';
import { ObjectId } from 'mongoose';
import { availableOptions, availableProductSorts } from '../../config';
import { Direction } from '../../enums/common_enum';

const MAX_ID_LIST = 50;
@InputType()
export class ProductInput {
    @IsNotEmpty()
    @Field(() => ProductType)
    productType: ProductType;

    @IsOptional()
    @Field(() => ProductStatus, { nullable: true })
    productStatus?: ProductStatus;

    @IsNotEmpty()
    @Field(() => ProductCategory)
    productCategory: ProductCategory;

    @IsNotEmpty()
    @Field(() => ProductMaterial)
    productMaterial: ProductMaterial;

    @IsNotEmpty()
    @Field(() => ProductColor)
    productColor: ProductColor;

    @IsOptional()
    @Field(() => String)
    productSize?: string;

    @IsNotEmpty()
    @Length(3, 100)
    @Field(() => String)
    productTitle: string;

    @IsNotEmpty()
    @Field(() => Number)
    productPrice: number;

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

    @IsNotEmpty()
    @Field(() => ProductCondition)
    productCondition: ProductCondition;

    @IsOptional()
    @Field(() => String, { nullable: true })
    productBrand?: string;

    @IsOptional()
    @Field(() => String, { nullable: true })
    productOriginCountry?: string;

    @IsOptional()
    @Field(() => Date, { nullable: true })
    soldAt?: Date;

    memberId?: ObjectId;

    @IsOptional()
    @Field(() => Date, { nullable: true })
    constructedAt?: Date;
}

@InputType()
export class PricesRange {
    @Field(() => Int)
    start: number;

    @Field(() => Int)
    end: number;
}

@InputType()
export class SquaresRange {
    @Field(() => Int)
    start: number;

    @Field(() => Int)
    end: number;
}

@InputType()
export class PeriodsRange {
    @Field(() => Date)
    start: Date;

    @Field(() => Date)
    end: Date;
}

@InputType()
export class PISearch {
    @IsOptional()
    @Field(() => Boolean, { nullable: true })
    productIsOnSale?: boolean;

  @IsOptional()
  @Field(() => String, { nullable: true })
  memberId?: ObjectId;

  @IsOptional()
  @Field(() => [ProductCategory], { nullable: true })
  categoryList?: ProductCategory[];

  @IsOptional()
  @Field(() => [ProductType], { nullable: true })
  typeList?: ProductType[];

  @IsOptional()
  @Field(() => [ProductCondition], { nullable: true })
  conditionList?: ProductCondition[];

  @IsOptional()
  @Field(() => [String], { nullable: true })
  materialList?: string[]; // misol: ['yog‘och', 'metal', 'plastik']

  @IsOptional()
  @Field(() => [String], { nullable: true })
  colorList?: string[]; // misol: ['oq', 'qora', 'kulrang']

  @IsOptional()
  @Field(() => PricesRange, { nullable: true })
  pricesRange?: PricesRange;

  @IsOptional()
  @IsIn(availableOptions, { each: true })
  @Field(() => [String], { nullable: true })
  options?: string[];

  @IsOptional()
  @Field(() => String, { nullable: true })
  text?: string;

  /** Aniq mahsulotlar (widget'dagi sevimlilar) */
  @IsOptional()
  @IsMongoId({ each: true })
  @ArrayMaxSize(MAX_ID_LIST)
  @Field(() => [String], { nullable: true })
  idList?: string[];
}

@InputType()
export class ProductsInquiry {
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number;

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number;

    @IsOptional()
    @IsIn(availableProductSorts)
    @Field(() => String, { nullable: true })
    sort?: string;

    @IsOptional()
    @Field(() => Direction, { nullable: true })
    direction?: Direction;

    @IsNotEmpty()
    @Field(() => PISearch)
    search: PISearch;
}

@InputType()
class APISearch {
    @IsOptional()
    @Field(() => ProductStatus, { nullable: true })
    productStatus?: ProductStatus;
}

@InputType()
export class AgentProductsInquiry {
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number;

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number;

    @IsOptional()
    @IsIn(availableProductSorts)
    @Field(() => String, { nullable: true })
    sort?: string;

    @IsOptional()
    @Field(() => Direction, { nullable: true })
    direction?: Direction;

    @IsNotEmpty()
    @Field(() => APISearch)
    search: APISearch;
}

@InputType()
class ALPISearch {
    @IsOptional()
    @Field(() => ProductStatus, { nullable: true })
    productStatus?: ProductStatus;

    @IsOptional()
    @Field(() => [ProductCategory], { nullable: true })
    productCategory?: ProductCategory[];
}

@InputType()
export class AllProductsInquiry {
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number;

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number;

    @IsOptional()
    @IsIn(availableProductSorts)
    @Field(() => String, { nullable: true })
    sort?: string;

    @IsOptional()
    @Field(() => Direction, { nullable: true })
    direction?: Direction;

    @IsNotEmpty()
    @Field(() => ALPISearch)
    search: ALPISearch;
}

@InputType()
export class OrdinaryInquiry {
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number;

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number;
}