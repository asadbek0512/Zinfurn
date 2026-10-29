import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, MeLiked } from '../../libs/dto/like/like';
import { Model, ObjectId } from 'mongoose';
import { LikeInput } from '../../libs/dto/like/like.input';
import { T } from '../../libs/types/common';
import { Message } from '../../libs/enums/common_enum';
import { OrdinaryInquiry } from '../../libs/dto/product/product.input';
import { Products } from '../../libs/dto/product/product';
import { LikeGroup } from '../../libs/enums/like.enum';
import { lookupFavorite, lookupRepairFavorite } from '../../libs/config';
import { RepairOrdinaryInquiry } from '../../libs/dto/repairProduct/repairProduct.input';
import { RepairProducts } from '../../libs/dto/repairProduct/repairProduct';
import { NotificationService } from '../notification/notification.service';
import { NotificationGroup, NotificationType } from '../../libs/enums/notification.enum';

@Injectable()
export class LikeService {
	constructor(
		@InjectModel('Like') private readonly likeModel: Model<Like>,
		private readonly notificationService: NotificationService,
		@InjectModel('Product') private readonly productModel: Model<any>,
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

				if (input.likeGroup === LikeGroup.PRODUCT) {
					const product = await this.productModel.findById(input.likeRefId).exec();
					if (product) {
						receiverId = product.memberId.toString();
						notificationDesc = `${likerName} liked your product "${product.productTitle}"`;
					}
				} else if (input.likeGroup === LikeGroup.ARTICLE) {
					const article = await this.boardArticleModel.findById(input.likeRefId).exec();
					if (article) {
						receiverId = article.memberId.toString();
						notificationDesc = `${likerName} liked your article "${article.articleTitle}"`;
					}
				} else if (input.likeGroup === LikeGroup.MEMBER) {
					notificationDesc = `${likerName} liked your profile`;
				} else if (input.likeGroup === LikeGroup.REPAIR_PRODUCT) {
					notificationDesc = `${likerName} liked your Repair Product`;
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
				Logger.error('Error, Service.model: ', err.message);
				throw new BadRequestException(Message.CREATE_FAILED);
			}
		}
		return modifier;
	}

	private mapLikeGroupToNotificationGroup(likeGroup: LikeGroup): NotificationGroup {
		switch (likeGroup) {
			case LikeGroup.PRODUCT:
				return NotificationGroup.PRODUCT;
			case LikeGroup.ARTICLE:
				return NotificationGroup.ARTICLE;
			case LikeGroup.MEMBER:
				return NotificationGroup.MEMBER;
			case LikeGroup.REPAIR_PRODUCT:
				return NotificationGroup.REPAIR_PRODUCT;
			default:
				return NotificationGroup.MEMBER;
		}
	}

	public async checkLikeExistence(input: LikeInput): Promise<MeLiked[]> {
		const { memberId, likeRefId } = input;
		const result = await this.likeModel.findOne({ memberId: memberId, likeRefId: likeRefId }).exec();
		return result ? [{ memberId: memberId, likeRefId: likeRefId, myFavorite: true }] : [];
	}

	public async getFavoriteProducts(memberId: ObjectId, input: OrdinaryInquiry): Promise<Products> {
		const { page, limit } = input;
		const match: T = { likeGroup: LikeGroup.PRODUCT, memberId: memberId };

		const data: T = await this.likeModel
			.aggregate([
				{ $match: match },
				{ $sort: { updatedAt: -1 } },
				{
					$lookup: {
						from: 'products',
						localField: 'likeRefId',
						foreignField: '_id',
						as: 'favoriteProduct',
					},
				},
				{ $unwind: '$favoriteProduct' },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							lookupFavorite,
							{ $unwind: '$favoriteProduct.memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		const result: Products = { list: [], metaCounter: data[0].metaCounter };
		result.list = data[0].list.map((ele) => ele.favoriteProduct);
		return result;
	}

	public async getFavoriteRepairProducts(
		memberId: ObjectId,
		input: RepairOrdinaryInquiry,
	): Promise<RepairProducts> {
		const { page, limit } = input;
		const match: T = {
			likeGroup: LikeGroup.REPAIR_PRODUCT,
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
						as: 'favoriteRepairProduct',
					},
				},
				{ $unwind: '$favoriteRepairProduct' },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							lookupRepairFavorite,
							{ $unwind: '$favoriteRepairProduct.memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		const result: RepairProducts = { list: [], metaCounter: data[0].metaCounter };
		result.list = data[0].list.map((ele) => ele.favoriteRepairProduct);
		return result;
	}

	/** Shu obyektni yoqtirgan a'zolar (narx tushganda xabar berish uchun) */
	public async findLikerIds(likeGroup: LikeGroup, likeRefId: ObjectId): Promise<string[]> {
		const likes = await this.likeModel.find({ likeGroup, likeRefId }, { memberId: 1 }).lean().exec();
		return likes.map((like) => like.memberId.toString());
	}
}
