import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, MeLiked } from '../../libs/dto/like/like';
import { Model, ObjectId } from 'mongoose';
import { LikeInput } from '../../libs/dto/like/like.input';
import { T } from '../../libs/types/common';
import { Message } from '../../libs/enums/common_enum';
import { OrdinaryInquiry } from '../../libs/dto/property/property.input';
import { Properties } from '../../libs/dto/property/property';
import { LikeGroup } from '../../libs/enums/like.enum';
import { lookupFavorite, lookupRepairFavorite } from '../../libs/config';
import { RepairOrdinaryInquiry } from '../../libs/dto/repairProperty/repairProperty.input';
import { RepairProperties } from '../../libs/dto/repairProperty/repairProperty';
import { NotificationService } from '../notification/notification.service';
import { NotificationGroup, NotificationType } from '../../libs/enums/notification.enum';

@Injectable()
export class LikeService {
	constructor(
		@InjectModel('Like') private readonly likeModel: Model<Like>,
		private readonly notificationService: NotificationService,
		@InjectModel('Property') private readonly propertyModel: Model<any>,
		@InjectModel('BoardArticle') private readonly boardArticleModel: Model<any>,
		@InjectModel('Member') private readonly memberModel: Model<any>,
	) {}

	public async toggleLike(input: LikeInput): Promise<number> {
		const search: T = { memberId: input.memberId, likeRefId: input.likeRefId },
			exist = await this.likeModel.findOne(search).exec();
		let modifier = 1;

		if (exist) {
			await this.likeModel.findOneAndDelete(search).exec();
			modifier = -1;
		} else {
			try {
				await this.likeModel.create(input);

				// Get the correct receiverId and content info based on the like group
				let receiverId = input.likeRefId.toString();
				let notificationDesc = '';

				// Get the liker's name
				const liker = await this.memberModel.findById(input.memberId).exec();
				const likerName = liker ? liker.memberNick : 'Someone';

				if (input.likeGroup === LikeGroup.PROPERTY) {
					const property = await this.propertyModel.findById(input.likeRefId).exec();
					if (property) {
						receiverId = property.memberId.toString();
						notificationDesc = `${likerName} liked your property "${property.propertyTitle}"`;
					}
				} else if (input.likeGroup === LikeGroup.ARTICLE) {
					const article = await this.boardArticleModel.findById(input.likeRefId).exec();
					if (article) {
						receiverId = article.memberId.toString();
						notificationDesc = `${likerName} liked your article "${article.articleTitle}"`;
					}
				} else if (input.likeGroup === LikeGroup.MEMBER) {
					notificationDesc = `${likerName} liked your profile`;
				} else if (input.likeGroup === LikeGroup.REPAIR_PROPERTY) {
					notificationDesc = `${likerName} liked your Repair Property`;
				}

				await this.notificationService.createNotification({
					notificationType: NotificationType.LIKE,
					notificationGroup: this.mapLikeGroupToNotificationGroup(input.likeGroup),
					notificationTitle: 'New Like',
					notificationDesc: notificationDesc,
					authorId: input.memberId.toString(),
					receiverId: receiverId,
				});
			} catch (err) {
				console.log('Error, Service.model: ', err.message);
				throw new BadRequestException(Message.CREATE_FAILED);
			}
		}
		console.log(`- Like modifier ${modifier} -`);
		return modifier;
	}

	private mapLikeGroupToNotificationGroup(likeGroup: LikeGroup): NotificationGroup {
		switch (likeGroup) {
			case LikeGroup.PROPERTY:
				return NotificationGroup.PROPERTY;
			case LikeGroup.ARTICLE:
				return NotificationGroup.ARTICLE;
			case LikeGroup.MEMBER:
				return NotificationGroup.MEMBER;
			case LikeGroup.REPAIR_PROPERTY:
				return NotificationGroup.REPAIR_PROPERTY;
			default:
				return NotificationGroup.MEMBER;
		}
	}

	public async checkLikeExistence(input: LikeInput): Promise<MeLiked[]> {
		const { memberId, likeRefId } = input;
		const result = await this.likeModel.findOne({ memberId: memberId, likeRefId: likeRefId }).exec();
		return result ? [{ memberId: memberId, likeRefId: likeRefId, myFavorite: true }] : [];
	}

	public async getFavoriteProperties(memberId: ObjectId, input: OrdinaryInquiry): Promise<Properties> {
		const { page, limit } = input;
		const match: T = { likeGroup: LikeGroup.PROPERTY, memberId: memberId };

		const data: T = await this.likeModel
			.aggregate([
				{ $match: match },
				{ $sort: { updatedAt: -1 } },
				{
					$lookup: {
						from: 'properties',
						localField: 'likeRefId',
						foreignField: '_id',
						as: 'favoriteProperty',
					},
				},
				{ $unwind: '$favoriteProperty' },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							lookupFavorite,
							{ $unwind: '$favoriteProperty.memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		const result: Properties = { list: [], metaCounter: data[0].metaCounter };
		result.list = data[0].list.map((ele) => ele.favoriteProperty);
		return result;
	}

	public async getFavoriteRepairProperties(
		memberId: ObjectId,
		input: RepairOrdinaryInquiry,
	): Promise<RepairProperties> {
		const { page, limit } = input;
		const match: T = {
			likeGroup: LikeGroup.REPAIR_PROPERTY,
			memberId: memberId,
		};

		const data: T = await this.likeModel
			.aggregate([
				{ $match: match },
				{ $sort: { updatedAt: -1 } },
				{
					$lookup: {
						from: 'repair_requests',
						localField: 'likeRefId',
						foreignField: '_id',
						as: 'favoriteRepairProperty',
					},
				},
				{ $unwind: '$favoriteRepairProperty' },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							lookupRepairFavorite,
							{ $unwind: '$favoriteRepairProperty.memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		const result: RepairProperties = { list: [], metaCounter: data[0].metaCounter };
		result.list = data[0].list.map((ele) => ele.favoriteRepairProperty);
		return result;
	}
}
