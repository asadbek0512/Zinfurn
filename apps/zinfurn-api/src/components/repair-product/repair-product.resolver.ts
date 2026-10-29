import { Query, Args, Mutation, Resolver } from '@nestjs/graphql';
import { RepairProductService } from './repair-product.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RepairProducts, RepairProduct } from '../../libs/dto/repairProduct/repairProduct';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { AllRepairProductsInquiry, RepairOrdinaryInquiry, RepairProductsInquiry, RepairProductInput, TechnicianProductsInquiry } from '../../libs/dto/repairProduct/repairProduct.input';
import { ShapeIntoMongoObjectId } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RepairProductUpdate } from '../../libs/dto/repairProduct/repairProduct.update';

@Resolver()
export class RepairProductResolver {
    constructor(private readonly repairProductService: RepairProductService) { }

    @Roles(MemberType.TECHNICIAN)
    @UseGuards(RolesGuard)
    @Mutation(() => RepairProduct)
    public async createRepairProduct(
        @Args('input') input: RepairProductInput,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<RepairProduct> {
        input.memberId = memberId
        return await this.repairProductService.createRepairProduct(input);
    }
    
    @UseGuards(WithoutGuard)
    @Query((returns) => RepairProduct)
    public async getRepairProduct(
        @Args('repairId') input: string,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<RepairProduct> {

        const repairId = ShapeIntoMongoObjectId(input);
        return await this.repairProductService.getRepairProduct(memberId, repairId);
    }

    @UseGuards(WithoutGuard)
    @Query((returns) => RepairProducts)
    public async getRepairProducts(
        @Args('input') input: RepairProductsInquiry,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<RepairProducts> {
        return await this.repairProductService.getRepairProducts(memberId, input);
    }

    @Roles(MemberType.TECHNICIAN)
    @UseGuards(RolesGuard)
    @Query((returns) => RepairProducts)
    public async getTechnicianProducts(
        @Args('input') input: TechnicianProductsInquiry,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<RepairProducts> {
        return await this.repairProductService.getTechnicianProducts(memberId, input);
    }

    @UseGuards(AuthGuard)
    @Query((returns) => RepairProducts)
    public async getRepairFavorites(
        @Args('input') input: RepairOrdinaryInquiry,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<RepairProducts> {
        return await this.repairProductService.getRepairFavorites(memberId, input);
    }

    @UseGuards(AuthGuard)
    @Query((returns) => RepairProducts)
    public async getRepairVisited(
        @Args('input') input: RepairOrdinaryInquiry,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<RepairProducts> {
        return await this.repairProductService.getRepairVisited(memberId, input);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => RepairProduct)
    public async likeTargetRepairProduct(
        @Args('repairId') input: string,
        @AuthMember('_id') memberId: ObjectId
    ): Promise<RepairProduct> {
        const likeRefId = ShapeIntoMongoObjectId(input)
        return await this.repairProductService.likeTargetRepairProduct(memberId, likeRefId);
    }

   /** ADMIN **/

   @Roles(MemberType.ADMIN)
   @UseGuards(RolesGuard)
   @Query((returns) => RepairProducts)
   public async getAllRepairProductsByAdmin(
       @Args('input') input: AllRepairProductsInquiry,
       @AuthMember('_id') memberId: ObjectId,
   ): Promise<RepairProducts> {
       return await this.repairProductService.getAllRepairProductsByAdmin(input);
   }


   @Roles(MemberType.ADMIN)
   @UseGuards(RolesGuard)
   @Mutation((returns) => RepairProduct)
   public async updateRepairProductByAdmin(@Args('input') input: RepairProductUpdate): Promise<RepairProduct> {
       input._id = ShapeIntoMongoObjectId(input._id);
       return await this.repairProductService.updateRepairProductByAdmin(input);
   }

   @Roles(MemberType.ADMIN)
   @UseGuards(RolesGuard)
   @Mutation((returns) => RepairProduct)
   public async removeRepairProductByAdmin(@Args('repairId') input: string): Promise<RepairProduct> {
       const repairId = ShapeIntoMongoObjectId(input);
       return await this.repairProductService.removeRepairProductByAdmin(repairId);
   }

}
