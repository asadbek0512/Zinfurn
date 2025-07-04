import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import {
    AgentPropertiesInquiry,
    AllPropertiesInquiry,
    OrdinaryInquiry,
    PropertiesInquiry,
    PropertyInput
} from '../../libs/dto/property/property.input';
import { Properties, Property } from '../../libs/dto/property/property';
import { Direction, Message } from '../../libs/enums/common_enum';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { PropertyStatus } from '../../libs/enums/property.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { PropertyUpdate } from '../../libs/dto/property/property.update';
import * as moment from 'moment'
import { ShapeIntoMongoObjectId, lookupAuthMemberLiked, lookupMember } from '../../libs/config';
import { LikeInput } from '../../libs/dto/like/like.input';
import { LikeGroup } from '../../libs/enums/like.enum';
import { LikeService } from '../like/like.service';

@Injectable()
export class PropertyService {
    constructor(
        @InjectModel('Property') private readonly propertyModel: Model<Property>,
        private memberService: MemberService,
        private viewService: ViewService,
        private likeService: LikeService
    ) { }

    public async createProperty(input: PropertyInput): Promise<Property> {
        try {
            console.log('executed');
            const propertyData = {
                ...input,
                propertyInStock: true,     // Majburiy true qilamiz
            };

            const result = await this.propertyModel.create(propertyData);
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

    public async getProperty(memberId: ObjectId, propertyId: ObjectId): Promise<Property> {
        const search: T = {
            _id: propertyId,
            propertyStatus: PropertyStatus.ACTIVE,
        };

        const targetProperty: Property | null = await this.propertyModel.findOne(search).lean().exec();
        if (!targetProperty) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        if (memberId) {
            const viewInput = { memberId: memberId, viewRefId: propertyId, viewGroup: ViewGroup.PROPERTY };
            const newView = await this.viewService.recordView(viewInput);
            if (newView) {
                await this.propertyStatsEditor({ _id: propertyId, targetKey: 'propertyViews', modifier: 1 });
                targetProperty.propertyViews++;
            }
            // melicked
            const LikeInput = { memberId: memberId, likeRefId: propertyId, likeGroup: LikeGroup.PROPERTY };
            targetProperty.meLiked = await this.likeService.checkLikeExistence(LikeInput)
        }

        targetProperty.memberData = await this.memberService.getMember(null, targetProperty.memberId);
        return targetProperty;
    }

    public async updateProperty(memberId: ObjectId, input: PropertyUpdate): Promise<Property> {
        let { propertyStatus, soldAt, deletedAt } = input;
        const search: T = {
            _id: input._id,
            memberId: memberId,
            propertyStatus: PropertyStatus.ACTIVE,
        };

        if (propertyStatus === PropertyStatus.SOLD) soldAt = moment().toDate();
        else if (propertyStatus === PropertyStatus.DELETE) deletedAt = moment().toDate();

        const result = await this.propertyModel
            .findOneAndUpdate(search, input, {
                new: true,
            })
            .exec();
        if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

        if (soldAt || deletedAt) {
            await this.memberService.memberStatsEditor({
                _id: memberId,
                targetKey: 'memberProperties',
                modifier: -1,
            });
        }

        return result;
    }

    public async getProperties(memberId: ObjectId, input: PropertiesInquiry): Promise<Properties> {
        const match: T = { propertyStatus: PropertyStatus.ACTIVE };
        const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

        this.shapeMatchQuery(match, input);
        console.log('match:', match);

        const result = await this.propertyModel
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
    private shapeMatchQuery(match: T, input: PropertiesInquiry): void {
        const {
            memberId,
            categoryList,
            typeList,
            conditionList,
            materialList,
            colorList,
            pricesRange,
            options,
            text,
        } = input.search;

        if (memberId) match.memberId = ShapeIntoMongoObjectId(memberId);
        if (categoryList && categoryList.length) match.propertyCategory = { $in: categoryList };
        if (typeList && typeList.length) match.propertyType = { $in: typeList };
        if (conditionList && conditionList.length) match.propertyCondition = { $in: conditionList };
        if (materialList && materialList.length) match.propertyMaterial = { $in: materialList };
        if (colorList && colorList.length) match.propertyColor = { $in: colorList };

        if (pricesRange) {
            match.propertyPrice = { $gte: pricesRange.start, $lte: pricesRange.end };
        }

        if (text) {
            match.propertyTitle = { $regex: new RegExp(text, 'i') };
        }

        if (options && options.length) {
            match['$or'] = options.map((ele) => ({ [ele]: true }));
        }
    }

    public async getFavorites(memberId: ObjectId, input: OrdinaryInquiry): Promise<Properties> {
        return await this.likeService.getFavoriteProperties(memberId, input);
    }

    public async getVisited(memberId: ObjectId, input: OrdinaryInquiry): Promise<Properties> {
        return await this.viewService.getVisitedProperties(memberId, input);
    }

    public async getAgentProperties(memberId: ObjectId, input: AgentPropertiesInquiry): Promise<Properties> {
        const { propertyStatus } = input.search;
        if (propertyStatus === PropertyStatus.DELETE) throw new BadRequestException(Message.NOT_ALLOWED_REQUEST);

        const match: T = {
            memberId: memberId,
            propertyStatus: propertyStatus ?? { $ne: PropertyStatus.DELETE },
        };
        const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

        const result = await this.propertyModel
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

    public async likeTargetProperty(memberId: ObjectId, likeRefId: ObjectId): Promise<Property> {
        const target: Property | null = await this.propertyModel
            .findOne({ _id: likeRefId, propertyStatus: PropertyStatus.ACTIVE })
            .exec();
        if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        const input: LikeInput = {
            memberId: memberId,
            likeRefId: likeRefId,
            likeGroup: LikeGroup.PROPERTY
        }

        const modifier: number = await this.likeService.toggleLike(input)
        const result = await this.propertyStatsEditor({ _id: likeRefId, targetKey: 'propertyLikes', modifier: modifier });

        if (!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
        return result;
    }

    public async getAllPropertiesByAdmin(input: AllPropertiesInquiry): Promise<Properties> {
        const { propertyStatus, propertyCategory } = input.search;
        const match: T = {};
        const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

        if (propertyStatus) match.propertyStatus = propertyStatus;
        if (propertyCategory) match.propertyLocation = { $in: propertyCategory };

        const result = await this.propertyModel
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

    public async updatePropertyByAdmin(input: PropertyUpdate): Promise<Property> {
        let { propertyStatus, soldAt, deletedAt } = input;
        const search: T = {
            _id: input._id,
            propertyStatus: PropertyStatus.ACTIVE,
        };

        if (propertyStatus === PropertyStatus.SOLD) soldAt = moment().toDate();
        else if (propertyStatus === PropertyStatus.DELETE) deletedAt = moment().toDate();

        const result = await this.propertyModel
            .findOneAndUpdate(search, input, {
                new: true,
            })
            .exec();
        if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

        if (soldAt || deletedAt) {
            await this.memberService.memberStatsEditor({
                _id: result.memberId,
                targetKey: 'memberProperties',
                modifier: -1,
            });
        }

        return result;
    }

    public async removePropertyByAdmin(propertyId: ObjectId): Promise<Property> {
        const search: T = { _id: propertyId, propertyStatus: PropertyStatus.DELETE };
        const result = await this.propertyModel.findOneAndDelete(search).exec();
        if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

        return result;
    }

    public async propertyStatsEditor(input: StatisticModifier): Promise<Property | null> {
        const { _id, targetKey, modifier } = input;
        return await this.propertyModel
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