import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { View } from '../../libs/dto/view/view';
import { ViewInput } from '../../libs/dto/view/view.input';
import { T } from '../../libs/types/common';
import { OrdinaryInquiry } from '../../libs/dto/product/product.input';
import { Products } from '../../libs/dto/product/product';
import { ViewGroup } from '../../libs/enums/view.enum';
import { lookupRepairVisit, lookupVisit } from '../../libs/config';
import { RepairOrdinaryInquiry } from '../../libs/dto/repairProduct/repairProduct.input';
import { RepairProducts } from '../../libs/dto/repairProduct/repairProduct';

@Injectable()
export class ViewService {
    constructor(@InjectModel('View') private readonly viewModel: Model<View>) { }

    public async recordView(input: ViewInput): Promise<View | null> {
        const viewExist = await this.checkViewExistence(input);
        if (!viewExist) {
            return await this.viewModel.create(input);
        } else return null;
    }

    private async checkViewExistence(input: ViewInput): Promise<View | null> {
        const { memberId, viewRefId } = input;
        const search: T = { memberId: memberId, viewRefId: viewRefId };
        return await this.viewModel.findOne(search).exec();
    }

    public async getVisitedProducts(memberId: ObjectId, input: OrdinaryInquiry): Promise<Products> {
        const { page, limit } = input;
        const match: T = { viewGroup: ViewGroup.PRODUCT, memberId: memberId };
    
        const data: T = await this.viewModel
            .aggregate([
                { $match: match },
                { $sort: { updatedAt: -1 } },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'viewRefId',
                        foreignField: '_id',
                        as: 'visitedProduct',
                    },
                },
                { $unwind: '$visitedProduct' },
                {
                    $facet: {
                        list: [
                            { $skip: (page - 1) * limit },
                            { $limit: limit },
                            lookupVisit,
                            { $unwind: '$visitedProduct.memberData' },
                        ],
                        metaCounter: [{ $count: 'total' }],
                    },
                },
            ])
            .exec();
            

        const result: Products = { list: [], metaCounter: data[0].metaCounter };
        result.list = data[0].list.map((ele) => ele.visitedProduct);
    
        return result;
    }


    public async getVisitedRepairProducts(memberId: ObjectId, input: RepairOrdinaryInquiry): Promise<RepairProducts> {
        const { page, limit } = input;
        const match: T = { viewGroup: ViewGroup.REPAIR_PRODUCT, memberId: memberId };
    
        const data: T = await this.viewModel
            .aggregate([
                { $match: match },
                { $sort: { updatedAt: -1 } },
                {
                    $lookup: {
                        from: 'repair_requests',
                        localField: 'viewRefId',
                        foreignField: '_id',
                        as: 'visitedRepairProduct',
                    },
                },
                { $unwind: '$visitedRepairProduct' },
                {
                    $facet: {
                        list: [
                            { $skip: (page - 1) * limit },
                            { $limit: limit },
                            lookupRepairVisit,
                            { $unwind: '$visitedRepairProduct.memberData' },
                        ],
                        metaCounter: [{ $count: 'total' }],
                    },
                },
            ])
            .exec();
        const result: RepairProducts = { list: [], metaCounter: data[0].metaCounter };
        result.list = data[0].list.map((ele) => ele.visitedRepairProduct);
    
        return result;
    }
    
}
