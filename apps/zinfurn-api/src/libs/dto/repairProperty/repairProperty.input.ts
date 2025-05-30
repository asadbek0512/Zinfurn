import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsArray, IsString, IsMongoId, IsEnum, Length, Min, IsIn } from 'class-validator';
import { PropertyStatus, PropertyType } from '../../enums/property.enum';
import { ObjectId } from 'mongoose';
import { Direction } from '../../enums/common_enum';
import { availableRepairPropertySorts } from '../../config';
import { RepairPropertyStatus, RepairPropertyType } from '../../enums/repairProperty.enum';

@InputType()
export class RepairPropertyInput {

    @IsNotEmpty()
    @Field(() => RepairPropertyType)
    repairPropertyType: PropertyType;

    @IsOptional()
    @Field(() => RepairPropertyStatus, { nullable: true })
    repairPropertyStatus?: RepairPropertyStatus;

    @IsNotEmpty()
    @Length(3, 100)
    @Field(() => String)
    repairPropertyAddress: string;

    @IsNotEmpty()
    @Length(5, 500)
    @Field(() => String)
    repairPropertyDescription: string;

    @IsOptional()
    @Field(() => [String], { nullable: true })
    repairPropertyImages?: string[];

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
    @Field(() => [RepairPropertyType], { nullable: true })
    typeList?: RepairPropertyType[];

    @IsOptional()
    @Field(() => RepairPropertyStatus, { nullable: true })
    repairPropertyStatus?: RepairPropertyStatus;

    @IsOptional()
    @Field(() => String, { nullable: true })
    text?: string;
}

@InputType()
export class RepairPropertiesInquiry {
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number;

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number;

    @IsOptional()
    @IsIn(availableRepairPropertySorts)
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
    @Field(() => RepairPropertyStatus, { nullable: true })
    repairPropertyStatus?: RepairPropertyStatus;
}

@InputType()
export class TechnicianPropertiesInquiry {
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number;

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number;

    @IsOptional()
    @IsIn(availableRepairPropertySorts)
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
export class AllRepairPropertiesInquiry {
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number;

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number;

    @IsOptional()
    @IsIn(availableRepairPropertySorts)
    @Field(() => String, { nullable: true })
    sort?: string;

    @IsOptional()
    @Field(() => Direction, { nullable: true })
    direction?: Direction;

    @IsNotEmpty()
    @Field(() => RAPISearch)
    search: RAPISearch;
}
