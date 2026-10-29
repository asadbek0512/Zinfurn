import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { LikeService } from '../like/like.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { RepairProducts, RepairProduct } from '../../libs/dto/repairProduct/repairProduct';
import { AllRepairProductsInquiry, RepairOrdinaryInquiry, RepairProductsInquiry, RepairProductInput, TechnicianProductsInquiry } from '../../libs/dto/repairProduct/repairProduct.input';
import { Direction, Message } from '../../libs/enums/common_enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { ViewGroup } from '../../libs/enums/view.enum';
import { LikeGroup } from '../../libs/enums/like.enum';
import { RepairProductStatus } from '../../libs/enums/repairProduct.enum';
import { ShapeIntoMongoObjectId, buildSearchRegex, lookupAuthMemberLiked, lookupMember } from '../../libs/config';
import { LikeInput } from '../../libs/dto/like/like.input';
import { RepairProductUpdate } from '../../libs/dto/repairProduct/repairProduct.update';
import * as moment from 'moment'
import { TranslationService } from '../translation/translation.service';

@Injectable()
export class RepairProductService {
    constructor(
        @InjectModel('RepairProduct') private readonly repairProductModel: Model<RepairProduct>,
        private memberService: MemberService,
        private viewService: ViewService,
        private likeService: LikeService,
        private translationService: TranslationService,
    ) { }

    public async createRepairProduct(input: RepairProductInput): Promise<RepairProduct> {
        try {
            const data: T = { ...input };
            // Tarjima (NON-BLOCKING: xato bo'lsa ham saqlanadi)
            try {
                const translations = await this.translationService.translateArticle(input.repairProductDescription, '');
                if (translations) data.repairProductTranslations = translations;
            } catch (e) {
                Logger.warn('Tarjima o\'tkazib yuborildi (repair create)');
            }
            const result = await this.repairProductModel.create(data);
            await this.memberService.memberStatsEditor({
                _id: result.memberId,
                targetKey: 'memberProducts',
                modifier: 1,
            })
            return result;
        } catch (err) {
            Logger.error("Error, Service.model:", err.message);
            throw new BadRequestException(Message.CREATE_FAILED);
        }
    }
    public async getRepairProduct(memberId: ObjectId, repairId: ObjectId): Promise<RepairProduct> {
        // findById o'rniga findOne ishlatish kerak
        const search: T = {
            _id: repairId,
            repairProductStatus: RepairProductStatus.ACTIVE,
        };
    
        const targetProduct: RepairProduct | null = await this.repairProductModel
            .findOne(search) // findById o'rniga findOne
            .lean()
            .exec();
    
        if (!targetProduct) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    
        if (memberId) {
            const viewInput = { memberId: memberId, viewRefId: repairId, viewGroup: ViewGroup.REPAIR_PRODUCT };
            
            const newView = await this.viewService.recordView(viewInput);
            
            if (newView) {
                await this.repairProductStatsEditor({ _id: repairId, targetKey: 'repairProductViews', modifier: 1 });
                targetProduct.repairProductViews++;
            }
            
            // meLiked
            const LikeInput = { memberId: memberId, likeRefId: repairId, likeGroup: LikeGroup.REPAIR_PRODUCT };
            targetProduct.meLiked = await this.likeService.checkLikeExistence(LikeInput);
        }
    
        targetProduct.memberData = await this.memberService.getMember(null, targetProduct.memberId);
    
        return targetProduct;
    }

    public async getRepairProducts(memberId: ObjectId, input: RepairProductsInquiry): Promise<RepairProducts> {
        const match: T = { repairProductStatus: RepairProductStatus.ACTIVE };
        const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

        this.shapeMatchQuery(match, input);

        const result = await this.repairProductModel
            .aggregate([
                { $match: match },
                { $sort: sort },
                {
                    $facet: {
                        list: [
                            { $skip: (input.page - 1) * input.limit },
                            { $limit: input.limit },
                            lookupAuthMemberLiked(memberId),
                            lookupMember,
                            { $unwind: '$memberData' },
                        ],
                        metaCounter: [{ $count: 'total' }],
                    },
                },
            ])
            .exec();
        if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        return result[0];
    }

    private shapeMatchQuery(match: T, input: RepairProductsInquiry): void {
        const {
            memberId,
            typeList,
            text,
        } = input.search;

        if (memberId) match.memberId = ShapeIntoMongoObjectId(memberId);
        if (typeList && typeList.length) match.productType = { $in: typeList };

        if (text) {
            match.productTitle = buildSearchRegex(text);
        }
    }

    public async getTechnicianProducts(memberId: ObjectId, input: TechnicianProductsInquiry): Promise<RepairProducts> {
        const { repairProductStatus } = input.search;
        if (repairProductStatus === RepairProductStatus.DELETE) throw new BadRequestException(Message.NOT_ALLOWED_REQUEST);

        const match: T = {
            memberId: memberId,
            repairProductStatus: repairProductStatus ?? { $ne: RepairProductStatus.DELETE },
        };
        const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

        const result = await this.repairProductModel
            .aggregate([
                { $match: match },
                { $sort: sort },
                {
                    $facet: {
                        list: [
                            { $skip: (input.page - 1) * input.limit },
                            { $limit: input.limit },
                            lookupMember, // productimizni memberIdsini boshqa kollekshindan lookup qilyapmiz
                            { $unwind: '$memberData' },
                        ],
                        metaCounter: [{ $count: 'total' }],
                    },
                },
            ])
            .exec();
        if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        return result[0];
    }

    public async getRepairFavorites(memberId: ObjectId, input: RepairOrdinaryInquiry): Promise<RepairProducts> {
        return await this.likeService.getFavoriteRepairProducts(memberId, input);
    }

    public async getRepairVisited(memberId: ObjectId, input: RepairOrdinaryInquiry): Promise<RepairProducts> {
        return await this.viewService.getVisitedRepairProducts(memberId, input);
    }

    public async likeTargetRepairProduct(memberId: ObjectId, likeRefId: ObjectId): Promise<RepairProduct> {
        const target: RepairProduct | null = await this.repairProductModel
            .findOne({ _id: likeRefId, repairProductStatus: RepairProductStatus.ACTIVE })
            .exec();
        if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        const input: LikeInput = {
            memberId: memberId,
            likeRefId: likeRefId,
            likeGroup: LikeGroup.REPAIR_PRODUCT
        }

        const modifier: number = await this.likeService.toggleLike(input)
        const result = await this.repairProductStatsEditor({ _id: likeRefId, targetKey: 'repairProductLikes', modifier: modifier });

        if (!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
        return result;
    }

    public async getAllRepairProductsByAdmin(input: AllRepairProductsInquiry): Promise<RepairProducts> {
        const { repairProductStatus } = input.search;
        const match: T = {};
        const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

        if (repairProductStatus) match.repairProductStatus = repairProductStatus;
        const result = await this.repairProductModel
            .aggregate([
                { $match: match },
                { $sort: sort },
                {
                    $facet: {
                        list: [
                            { $skip: (input.page - 1) * input.limit },
                            { $limit: input.limit }, // [product1 ,product2]
                            lookupMember, // memberDate: [memberDataValue]
                            { $unwind: '$memberData' }, // memberData: memberDataValue
                        ],
                        metaCounter: [{ $count: 'total' }],
                    },
                },
            ])
            .exec();
        if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        return result[0];
    }

    public async updateRepairProductByAdmin(input: RepairProductUpdate): Promise<RepairProduct> {
        let { repairProductStatus, deletedAt } = input;
        const search: T = {
            _id: input._id,
            repairProductStatus: RepairProductStatus.ACTIVE,
        };

        if (repairProductStatus === RepairProductStatus.DELETE) deletedAt = moment().toDate();

        const result = await this.repairProductModel
            .findOneAndUpdate(search, input, {
                new: true,
            })
            .exec();
        if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

        if (deletedAt) {
            await this.memberService.memberStatsEditor({
                _id: result.memberId,
                targetKey: 'memberProducts',
                modifier: -1,
            });
        }

        return result;
    }

    public async removeRepairProductByAdmin(repairId: ObjectId): Promise<RepairProduct> {
        const search: T = { _id: repairId, productStatus: RepairProductStatus.DELETE };
        const result = await this.repairProductModel.findByIdAndDelete(search).exec();
        if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

        return result;
    }

    public async repairProductStatsEditor(input: StatisticModifier): Promise<RepairProduct | null> {
        const { _id, targetKey, modifier } = input;
        return await this.repairProductModel
            .findByIdAndUpdate(
                _id,
                { $inc: { [targetKey]: modifier } },
                {
                    new: true,
                },
            )
            .exec();
    }
}
