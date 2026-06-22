import { Query, Args, Mutation, Resolver } from '@nestjs/graphql';
import { RepairPropertyService } from './repair-property.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RepairProperties, RepairProperty } from '../../libs/dto/repairProperty/repairProperty';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { AllRepairPropertiesInquiry, RepairOrdinaryInquiry, RepairPropertiesInquiry, RepairPropertyInput, TechnicianPropertiesInquiry } from '../../libs/dto/repairProperty/repairProperty.input';
import { ShapeIntoMongoObjectId } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RepairPropertyUpdate } from '../../libs/dto/repairProperty/repairProperty.update';

@Resolver()
export class RepairPropertyResolver {
    constructor(private readonly repairPropertyService: RepairPropertyService) { }

    @Roles(MemberType.TECHNICIAN)
    @UseGuards(RolesGuard)
    @Mutation(() => RepairProperty)
    public async createRepairProperty(
        @Args('input') input: RepairPropertyInput,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<RepairProperty> {
        input.memberId = memberId
        return await this.repairPropertyService.createRepairProperty(input);
    }
    
    @UseGuards(WithoutGuard)
    @Query((returns) => RepairProperty)
    public async getRepairProperty(
        @Args('repairId') input: string,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<RepairProperty> {

        const repairId = ShapeIntoMongoObjectId(input);
        return await this.repairPropertyService.getRepairProperty(memberId, repairId);
    }

    @UseGuards(WithoutGuard)
    @Query((returns) => RepairProperties)
    public async getRepairProperties(
        @Args('input') input: RepairPropertiesInquiry,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<RepairProperties> {
        return await this.repairPropertyService.getRepairProperties(memberId, input);
    }

    @Roles(MemberType.TECHNICIAN)
    @UseGuards(RolesGuard)
    @Query((returns) => RepairProperties)
    public async getTechnicianProperties(
        @Args('input') input: TechnicianPropertiesInquiry,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<RepairProperties> {
        return await this.repairPropertyService.getTechnicianProperties(memberId, input);
    }

    @UseGuards(AuthGuard)
    @Query((returns) => RepairProperties)
    public async getRepairFavorites(
        @Args('input') input: RepairOrdinaryInquiry,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<RepairProperties> {
        return await this.repairPropertyService.getRepairFavorites(memberId, input);
    }

    @UseGuards(AuthGuard)
    @Query((returns) => RepairProperties)
    public async getRepairVisited(
        @Args('input') input: RepairOrdinaryInquiry,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<RepairProperties> {
        return await this.repairPropertyService.getRepairVisited(memberId, input);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => RepairProperty)
    public async likeTargetRepairProperty(
        @Args('repairId') input: string,
        @AuthMember('_id') memberId: ObjectId
    ): Promise<RepairProperty> {
        const likeRefId = ShapeIntoMongoObjectId(input)
        return await this.repairPropertyService.likeTargetRepairProperty(memberId, likeRefId);
    }

   /** ADMIN **/

   @Roles(MemberType.ADMIN)
   @UseGuards(RolesGuard)
   @Query((returns) => RepairProperties)
   public async getAllRepairPropertiesByAdmin(
       @Args('input') input: AllRepairPropertiesInquiry,
       @AuthMember('_id') memberId: ObjectId,
   ): Promise<RepairProperties> {
       return await this.repairPropertyService.getAllRepairPropertiesByAdmin(input);
   }


   @Roles(MemberType.ADMIN)
   @UseGuards(RolesGuard)
   @Mutation((returns) => RepairProperty)
   public async updateRepairPropertyByAdmin(@Args('input') input: RepairPropertyUpdate): Promise<RepairProperty> {
       input._id = ShapeIntoMongoObjectId(input._id);
       return await this.repairPropertyService.updateRepairPropertyByAdmin(input);
   }

   @Roles(MemberType.ADMIN)
   @UseGuards(RolesGuard)
   @Mutation((returns) => RepairProperty)
   public async removeRepairPropertyByAdmin(@Args('repairId') input: string): Promise<RepairProperty> {
       const repairId = ShapeIntoMongoObjectId(input);
       return await this.repairPropertyService.removeRepairPropertyByAdmin(repairId);
   }

}
