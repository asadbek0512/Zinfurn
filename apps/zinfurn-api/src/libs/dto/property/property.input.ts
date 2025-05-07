import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length, Min, IsInt, IsIn } from 'class-validator';
import { PropertyType, PropertyStatus, PropertyCategory, PropertyMaterial, PropertyColor, PropertyCondition } from '../../enums/property.enum';
import { ObjectId } from 'mongoose';
import { availableOptions, availablePropertySorts } from '../../config';
import { Direction } from '../../enums/common_enum';
@InputType()
export class PropertyInput {
    @IsNotEmpty()
    @Field(() => PropertyType)
    propertyType: PropertyType;

    @IsOptional()
    @Field(() => PropertyStatus, { nullable: true })
    propertyStatus?: PropertyStatus;

    @IsNotEmpty()
    @Field(() => PropertyCategory)
    propertyCategory: PropertyCategory;

    @IsNotEmpty()
    @Field(() => PropertyMaterial)
    propertyMaterial: PropertyMaterial;

    @IsNotEmpty()
    @Field(() => PropertyColor)
    propertyColor: PropertyColor;

    @IsNotEmpty()
    @Field(() => String)
    propertySize: string;

    @IsNotEmpty()
    @Length(3, 100)
    @Field(() => String)
    propertyTitle: string;

    @IsNotEmpty()
    @Field(() => Number)
    propertyPrice: number;

    @IsOptional()
    @Field(() => Number, { nullable: true })
    propertySalePrice?: number;

    @IsOptional()
    @Field(() => Boolean, { nullable: true })
    propertyIsOnSale?: boolean;

    @IsOptional()
    @Field(() => Date, { nullable: true })
    propertySaleExpiresAt?: Date;

    @IsOptional()
    @Field(() => [String], { nullable: true })
    propertyImages?: string[];

    @IsOptional()
    @Length(5, 500)
    @Field(() => String, { nullable: true })
    propertyDesc?: string;

    @IsOptional()
    @Field(() => Boolean, { nullable: true })
    propertyBarter?: boolean;

    @IsOptional()
    @Field(() => Boolean, { nullable: true })
    propertyRent?: boolean;

    @IsOptional()
    @Field(() => Boolean, { nullable: true })
    propertyInStock?: boolean;

    @IsNotEmpty()
    @Field(() => PropertyCondition)
    propertyCondition: PropertyCondition;

    @IsOptional()
    @Field(() => String, { nullable: true })
    propertyBrand?: string;

    @IsOptional()
    @Field(() => String, { nullable: true })
    propertyOriginCountry?: string;

    @IsOptional()
    @Field(() => Date, { nullable: true })
    soldAt?: Date;


    @IsOptional()
    @Field(() => Date, { nullable: true })
    constructedAt?: Date;
    memberId: import("mongoose").Schema.Types.ObjectId;
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
  @Field(() => String, { nullable: true })
  memberId?: ObjectId;

  @IsOptional()
  @Field(() => [PropertyCategory], { nullable: true })
  categoryList?: PropertyCategory[];

  @IsOptional()
  @Field(() => [PropertyType], { nullable: true })
  typeList?: PropertyType[];

  @IsOptional()
  @Field(() => [PropertyCondition], { nullable: true })
  conditionList?: PropertyCondition[];

  @IsOptional()
  @Field(() => [String], { nullable: true })
  materialList?: string[]; // misol: ['yog‘och', 'metal', 'plastik']

  @IsOptional()
  @Field(() => [String], { nullable: true })
  colorList?: string[]; // misol: ['oq', 'qora', 'kulrang']

//   @IsOptional()
//   @Field(() => DimensionsRange, { nullable: true })
//   dimensionsRange?: DimensionsRange; // o‘lchamlar (U/E/B)

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
}

// @InputType()
// export class DimensionsRange {
//   @IsOptional()
//   @Field(() => Int, { nullable: true })
//   minLength?: number;

//   @IsOptional()
//   @Field(() => Int, { nullable: true })
//   maxLength?: number;

//   @IsOptional()
//   @Field(() => Int, { nullable: true })
//   minWidth?: number;

//   @IsOptional()
//   @Field(() => Int, { nullable: true })
//   maxWidth?: number;

//   @IsOptional()
//   @Field(() => Int, { nullable: true })
//   minHeight?: number;

//   @IsOptional()
//   @Field(() => Int, { nullable: true })
//   maxHeight?: number;
// }


@InputType()
export class PropertiesInquiry {
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number;

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number;

    @IsOptional()
    @IsIn(availablePropertySorts)
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
    @Field(() => PropertyStatus, { nullable: true })
    propertyStatus?: PropertyStatus;
}

@InputType()
export class AgentPropertiesInquiry {
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number;

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number;

    @IsOptional()
    @IsIn(availablePropertySorts)
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
    @Field(() => PropertyStatus, { nullable: true })
    propertyStatus?: PropertyStatus;

    @IsOptional()
    @Field(() => [PropertyCategory], { nullable: true })
    propertyCategory?: PropertyCategory[];
}

@InputType()
export class AllPropertiesInquiry {
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number;

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number;

    @IsOptional()
    @IsIn(availablePropertySorts)
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