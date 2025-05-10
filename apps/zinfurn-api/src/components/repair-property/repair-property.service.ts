import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { LikeService } from '../like/like.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { RepairProperties, RepairProperty } from '../../libs/dto/repairProperty/repairProperty';
import { AllRepairPropertiesInquiry, RepairOrdinaryInquiry, RepairPropertiesInquiry, RepairPropertyInput, TechnicianPropertiesInquiry } from '../../libs/dto/repairProperty/repairProperty.input';
import { Direction, Message } from '../../libs/enums/common_enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { ViewGroup } from '../../libs/enums/view.enum';
import { LikeGroup } from '../../libs/enums/like.enum';
import { RepairPropertyStatus } from '../../libs/enums/repairProperty.enum';
import { ShapeIntoMongoObjectId, lookupAuthMemberLiked, lookupMember } from '../../libs/config';
import { LikeInput } from '../../libs/dto/like/like.input';
import { RepairPropertyUpdate } from '../../libs/dto/repairProperty/repairProperty.update';
import * as moment from 'moment'

@Injectable()
export class RepairPropertyService {
    constructor(
        @InjectModel('RepairProperty') private readonly repairPropertyModel: Model<RepairProperty>,
        private memberService: MemberService,
        private viewService: ViewService,
        private likeService: LikeService
    ) { }

    public async createRepairProperty(input: RepairPropertyInput): Promise<RepairProperty> {
        try {
            console.log('executed');
            const result = await this.repairPropertyModel.create(input);
            await this.memberService.memberStatsEditor({
                _id: result.memberId,
                targetKey: 'memberProperties',
                modifier: 1,
            })
            return result;
        } catch (err) {
            console.log("Error, Service.model:", err.message);
            throw new BadRequestException(Message.CREATE_FAILED);
        }
    }

    public async getRepairProperty(memberId: ObjectId, repairId: ObjectId): Promise<RepairProperty> {
        const search: T = {
            _id: repairId,
            repairPropertyStatus: RepairPropertyStatus.ACTIVE,
        };

        const targetProperty: RepairProperty | null = await this.repairPropertyModel.findById(search).lean().exec();

        if (!targetProperty) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        if (memberId) {
            const viewInput = { memberId: memberId, viewRefId: repairId, viewGroup: ViewGroup.REPAIRPROPERTY };
            const newView = await this.viewService.recordView(viewInput);
            if (newView) {
                await this.repairPropertyStatsEditor({ _id: repairId, targetKey: 'repairViews', modifier: 1 });
                targetProperty.repairPropertyViews++;
            }
            // melicked
            const LikeInput = { memberId: memberId, likeRefId: repairId, likeGroup: LikeGroup.REPAIRPROPERTY };
            targetProperty.meLiked = await this.likeService.checkLikeExistence(LikeInput)
        }


        targetProperty.memberData = await this.memberService.getMember(null, targetProperty.memberId);
        console.log("=====> ", targetProperty)

        return targetProperty;
    }

    public async getRepairProperties(memberId: ObjectId, input: RepairPropertiesInquiry): Promise<RepairProperties> {
        const match: T = { repairPropertyStatus: RepairPropertyStatus.ACTIVE };
        const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

        this.shapeMatchQuery(match, input);
        console.log('match:', match);

        const result = await this.repairPropertyModel
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

    private shapeMatchQuery(match: T, input: RepairPropertiesInquiry): void {
        const {
            memberId,
            typeList,
            text,
        } = input.search;

        if (memberId) match.memberId = ShapeIntoMongoObjectId(memberId);
        if (typeList && typeList.length) match.propertyType = { $in: typeList };

        if (text) {
            match.propertyTitle = { $regex: new RegExp(text, 'i') };
        }
    }

    public async getTechnicianProperties(memberId: ObjectId, input: TechnicianPropertiesInquiry): Promise<RepairProperties> {
        const { repairPropertyStatus } = input.search;
        if (repairPropertyStatus === RepairPropertyStatus.DELETE) throw new BadRequestException(Message.NOT_ALLOWED_REQUEST);

        const match: T = {
            memberId: memberId,
            repairPropertyStatus: repairPropertyStatus ?? { $ne: RepairPropertyStatus.DELETE },
        };
        const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

        const result = await this.repairPropertyModel
            .aggregate([
                { $match: match },
                { $sort: sort },
                {
                    $facet: {
                        list: [
                            { $skip: (input.page - 1) * input.limit },
                            { $limit: input.limit },
                            lookupMember, // propertimizni memberIdsini boshqa kollekshindan lookup qilyapmiz
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

    public async getRepairFavorites(memberId: ObjectId, input: RepairOrdinaryInquiry): Promise<RepairProperties> {
        return await this.likeService.getFavoriteRepairProperties(memberId, input);
    }

    public async getRepairVisited(memberId: ObjectId, input: RepairOrdinaryInquiry): Promise<RepairProperties> {
        return await this.viewService.getVisitedRepairProperties(memberId, input);
    }

    public async likeTargetRepairProperty(memberId: ObjectId, likeRefId: ObjectId): Promise<RepairProperty> {
        const target: RepairProperty | null = await this.repairPropertyModel
            .findOne({ _id: likeRefId, repairPropertyStatus: RepairPropertyStatus.ACTIVE })
            .exec();
        if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        const input: LikeInput = {
            memberId: memberId,
            likeRefId: likeRefId,
            likeGroup: LikeGroup.REPAIRPROPERTY
        }

        const modifier: number = await this.likeService.toggleLike(input)
        const result = await this.repairPropertyStatsEditor({ _id: likeRefId, targetKey: 'repairPropertyLikes', modifier: modifier });

        if (!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
        return result;
    }

    public async getAllRepairPropertiesByAdmin(input: AllRepairPropertiesInquiry): Promise<RepairProperties> {
        const { repairPropertyStatus } = input.search;
        const match: T = {};
        const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

        if (repairPropertyStatus) match.repairPropertyStatus = repairPropertyStatus;
        const result = await this.repairPropertyModel
            .aggregate([
                { $match: match },
                { $sort: sort },
                {
                    $facet: {
                        list: [
                            { $skip: (input.page - 1) * input.limit },
                            { $limit: input.limit }, // [property1 ,property2]
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

    public async updateRepairPropertyByAdmin(input: RepairPropertyUpdate): Promise<RepairProperty> {
        let { repairPropertyStatus, deletedAt } = input;
        const search: T = {
            _id: input._id,
            repairPropertyStatus: RepairPropertyStatus.ACTIVE,
        };

        if (repairPropertyStatus === RepairPropertyStatus.DELETE) deletedAt = moment().toDate();

        const result = await this.repairPropertyModel
            .findOneAndUpdate(search, input, {
                new: true,
            })
            .exec();
        if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

        if (deletedAt) {
            await this.memberService.memberStatsEditor({
                _id: result.memberId,
                targetKey: 'memberProperties',
                modifier: -1,
            });
        }

        return result;
    }

    public async removeRepairPropertyByAdmin(repairId: ObjectId): Promise<RepairProperty> {
        const search: T = { _id: repairId, propertyStatus: RepairPropertyStatus.DELETE };
        const result = await this.repairPropertyModel.findByIdAndDelete(search).exec();
        if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

        return result;
    }

    public async repairPropertyStatsEditor(input: StatisticModifier): Promise<RepairProperty | null> {
        const { _id, targetKey, modifier } = input;
        return await this.repairPropertyModel
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
