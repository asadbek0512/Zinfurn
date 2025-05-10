import { Field, InputType } from "@nestjs/graphql";
import {  IsNotEmpty, IsOptional} from "class-validator";
import { ObjectId } from "mongoose";
import {  PropertyStatus, PropertyType } from "../../enums/property.enum";
import { RepairPropertyStatus, RepairPropertyType } from "../../enums/repairProperty.enum";

@InputType()
export class RepairPropertyUpdate {
  @IsNotEmpty()
  @Field(() => String)
  _id: ObjectId;

  @IsOptional()
  @Field(() => RepairPropertyType, { nullable: true })
  repairPropertyType?: RepairPropertyType;

  @IsOptional()
  @Field(() => RepairPropertyStatus, { nullable: true })
  repairPropertyStatus?: RepairPropertyStatus;

  deletedAt?: Date;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  constructedAt?: Date;

}
