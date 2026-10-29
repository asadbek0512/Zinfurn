import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsArray, IsString, IsMongoId, IsEnum, Length, Min, IsIn } from 'class-validator';
import { ProductStatus, ProductType } from '../../enums/product.enum';
import { ObjectId } from 'mongoose';
import { Direction } from '../../enums/common_enum';
import { availableRepairProductSorts } from '../../config';
import { RepairProductStatus, RepairProductType } from '../../enums/repairProduct.enum';

@InputType()
export class RepairProductInput {

    @IsNotEmpty()
    @Field(() => RepairProductType)
    repairProductType: ProductType;

    @IsOptional()
    @Field(() => RepairProductStatus, { nullable: true })
    repairProductStatus?: RepairProductStatus;

    @IsNotEmpty()
    @Length(3, 100)
    @Field(() => String)
    repairProductAddress: string;

    @IsNotEmpty()
    @Length(5, 500)
    @Field(() => String)
    repairProductDescription: string;

    @IsOptional()
    @Field(() => [String], { nullable: true })
    repairProductImages?: string[];

    @IsOptional()
    @Field(() => Date, { nullable: true })
    constructedAt?: Date;

    memberId?: ObjectId;
}

@InputType()
export class RepairPISearch {
    @IsOptional()
    @Field(() => String, { nullable: true })
    memberId?: ObjectId;

    @IsOptional()
    @Field(() => [RepairProductType], { nullable: true })
    typeList?: RepairProductType[];

    @IsOptional()
    @Field(() => RepairProductStatus, { nullable: true })
    repairProductStatus?: RepairProductStatus;

    @IsOptional()
    @Field(() => String, { nullable: true })
    text?: string;
}

@InputType()
export class RepairProductsInquiry {
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number;

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number;

    @IsOptional()
    @IsIn(availableRepairProductSorts)
    @Field(() => String, { nullable: true })
    sort?: string;

    @IsOptional()
    @Field(() => Direction, { nullable: true })
    direction?: Direction;

    @IsNotEmpty()
    @Field(() => RepairPISearch)
    search: RepairPISearch;

}

@InputType()
export class RepairOrdinaryInquiry {
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number;

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number;
}

@InputType()
class RAPISearch {
    @IsOptional()
    @Field(() => RepairProductStatus, { nullable: true })
    repairProductStatus?: RepairProductStatus;
}

@InputType()
export class TechnicianProductsInquiry {
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number;

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number;

    @IsOptional()
    @IsIn(availableRepairProductSorts)
    @Field(() => String, { nullable: true })
    sort?: string;

    @IsOptional()
    @Field(() => Direction, { nullable: true })
    direction?: Direction;

    @IsNotEmpty()
    @Field(() => RAPISearch)
    search: RAPISearch;
}

@InputType()
export class AllRepairProductsInquiry {
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number;

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number;

    @IsOptional()
    @IsIn(availableRepairProductSorts)
    @Field(() => String, { nullable: true })
    sort?: string;

    @IsOptional()
    @Field(() => Direction, { nullable: true })
    direction?: Direction;

    @IsNotEmpty()
    @Field(() => RAPISearch)
    search: RAPISearch;
}
