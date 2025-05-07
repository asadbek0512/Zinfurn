import { Field, InputType, Int } from "@nestjs/graphql";
import { IsInt, IsNotEmpty, IsOptional, Length, Min } from "class-validator";
import { ObjectId } from "mongoose";
import { PropertyCategory, PropertyColor, PropertyCondition, PropertyMaterial, PropertyStatus, PropertyType } from "../../enums/property.enum";

@InputType()
export class PropertyUpdate {
  @IsNotEmpty()
  @Field(() => String)
  _id: ObjectId;

  @IsOptional()
  @Field(() => PropertyType, { nullable: true })
  propertyType?: PropertyType;

  @IsOptional()
  @Field(() => PropertyStatus, { nullable: true })
  propertyStatus?: PropertyStatus;

  @IsOptional()
  @Field(() => PropertyCategory, { nullable: true })
  propertyCategory?: PropertyCategory;

  @IsOptional()
  @Field(() => PropertyMaterial, { nullable: true })
  propertyMaterial?: PropertyMaterial;

  @IsOptional()
  @Field(() => PropertyColor, { nullable: true })
  propertyColor?: PropertyColor;

  @IsOptional()
  @Field(() => String, { nullable: true })
  propertySize?: string;

  @IsOptional()
  @Length(3, 100)
  @Field(() => String, { nullable: true })
  propertyTitle?: string;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  propertyPrice?: number;

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

  @IsOptional()
  @Field(() => PropertyCondition, { nullable: true })
  propertyCondition?: PropertyCondition;

  @IsOptional()
  @Field(() => String, { nullable: true })
  propertyBrand?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  propertyOriginCountry?: string;


  soldAt?: Date;

  deletedAt?: Date;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  constructedAt?: Date;

}
