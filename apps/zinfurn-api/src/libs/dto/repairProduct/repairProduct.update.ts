import { Field, InputType } from "@nestjs/graphql";
import {  IsNotEmpty, IsOptional} from "class-validator";
import { ObjectId } from "mongoose";
import {  ProductStatus, ProductType } from "../../enums/product.enum";
import { RepairProductStatus, RepairProductType } from "../../enums/repairProduct.enum";

@InputType()
export class RepairProductUpdate {
  @IsNotEmpty()
  @Field(() => String)
  _id: ObjectId;

  @IsOptional()
  @Field(() => RepairProductType, { nullable: true })
  repairProductType?: RepairProductType;

  @IsOptional()
  @Field(() => RepairProductStatus, { nullable: true })
  repairProductStatus?: RepairProductStatus;

  deletedAt?: Date;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  constructedAt?: Date;

}
