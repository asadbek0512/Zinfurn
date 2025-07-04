import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, Comments } from '../../libs/dto/comment/comment';
import { MemberService } from '../member/member.service';
import { Model, ObjectId } from 'mongoose';
import { PropertyService } from '../property/property.service';
import { CommentInput, CommentsInquiry } from '../../libs/dto/comment/comment.input';
import { Direction, Message } from '../../libs/enums/common_enum';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { CommentUpdate } from '../../libs/dto/comment/comment.update';
import { T } from '../../libs/types/common';
import { lookupMember } from '../../libs/config';
import { NotificationService } from '../notification/notification.service';
import { NotificationGroup, NotificationType } from '../../libs/enums/notification.enum';
import { BoardArticleService } from '../board-article/board-article.service';
import { RepairPropertyService } from '../repair-property/repair-property.service';

@Injectable()
export class CommentService {
	constructor(
		@InjectModel('Comment') private readonly commentModule: Model<Comment>,
		private readonly memberService: MemberService,
		private readonly propertyService: PropertyService,
		private readonly boardArticleService: BoardArticleService,
		private readonly repairPropertyService: RepairPropertyService,

		private notificationService: NotificationService,
		@InjectModel('Member') private readonly memberModel: Model<any>,
	) {}

	public async createComment(memberId: ObjectId, input: CommentInput): Promise<Comment> {
		input.memberId = memberId;

		let result: Comment | null = null;
		try {
			result = await this.commentModule.create(input);

			// Get the owner ID of the commented item
			let ownerId: string | null = null;

			switch (input.commentGroup) {
				case CommentGroup.MEMBER:
					ownerId = input.commentRefId.toString();
					await this.memberService.memberStatsEditor({
						_id: input.commentRefId,
						targetKey: 'memberComments',
						modifier: 1,
					});
					break;
				case CommentGroup.PROPERTY:
					// @ts-ignore
					const property = await this.propertyService.getProperty(null, input.commentRefId);
					ownerId = property.memberId.toString();
					await this.propertyService.propertyStatsEditor({
						_id: input.commentRefId,
						targetKey: 'propertyComments',
						modifier: 1,
					});
					break;
				case CommentGroup.ARTICLE:
					// @ts-ignore
					const article = await this.boardArticleService.getBoardArticle(null, input.commentRefId);
					ownerId = article.memberId.toString();
					await this.boardArticleService.boardArticleStatsEditor({
						_id: input.commentRefId,
						targetKey: 'articleComments',
						modifier: 1,
					});
					break;
				case CommentGroup.REPAIR_PROPERTY:
					// @ts-ignore
					const repairProperty = await this.repairPropertyService.getRepairProperty(null, input.commentRefId);
					ownerId = repairProperty.memberId.toString();
					await this.repairPropertyService.repairPropertyStatsEditor({
						_id: input.commentRefId,
						targetKey: 'repairPropertyComments',
						modifier: 1,
					});
					break;
			}

			// Send notification if we have an owner ID and it's not a self-comment
			if (ownerId && ownerId !== memberId.toString()) {
				await this.sendCommentNotification(
					memberId.toString(),
					ownerId,
					input.commentGroup,
					input.commentContent,
					input.commentRefId.toString(),
				);
			}
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}

		if (!result) throw new InternalServerErrorException(Message.CREATE_FAILED);
		return result;
	}

	private async sendCommentNotification(
		authorId: string,
		receiverId: string,
		commentGroup: CommentGroup,
		commentContent: string,
		refId?: string,
	) {
		// Get the commenter's name
		const commenter = await this.memberModel.findById(authorId).exec();
		const commenterName = commenter ? commenter.memberNick : 'Someone';

		// Create notification description based on comment group
		let notificationDesc = '';

		switch (commentGroup) {
			case CommentGroup.PROPERTY:
				// @ts-ignore
				const property = await this.propertyService.getProperty(null, refId as any);
				notificationDesc = `${commenterName} commented on your property "${property.propertyTitle}"`;
				break;
			case CommentGroup.REPAIR_PROPERTY:
				// @ts-ignore
				const repairProperty = await this.repairPropertyService.getRepairProperty(null, refId as any);
				notificationDesc = `${commenterName} commented on your property "${repairProperty.repairPropertyType}"`;
				break;
			case CommentGroup.ARTICLE:
				// @ts-ignore
				const article = await this.boardArticleService.getBlog(null, refId as any);
				notificationDesc = `${commenterName} commented on your article "${article.articleTitle}"`;
				break;
			case CommentGroup.MEMBER:
				notificationDesc = `${commenterName} commented on your profile`;
				break;
		}

		// Send notification
		await this.notificationService.createNotification({
			notificationType: NotificationType.COMMENT,
			notificationGroup: this.mapCommentGroupToNotificationGroup(commentGroup),
			notificationTitle: 'New Comment',
			notificationDesc,
			authorId,
			receiverId,
		});
	}

	private mapCommentGroupToNotificationGroup(commentGroup: CommentGroup): NotificationGroup {
		switch (commentGroup) {
			case CommentGroup.PROPERTY:
				return NotificationGroup.PROPERTY;
			case CommentGroup.REPAIR_PROPERTY:
				return NotificationGroup.REPAIR_PROPERTY;
			case CommentGroup.ARTICLE:
				return NotificationGroup.ARTICLE;
			case CommentGroup.MEMBER:
				return NotificationGroup.MEMBER;
			default:
				return NotificationGroup.MEMBER;
		}
	}

	public async updateComment(memberId: ObjectId, input: CommentUpdate): Promise<Comment> {
		const { _id } = input;
		const result = await this.commentModule.findOneAndUpdate(
			{
				_id: _id,
				memberId: memberId,
				commentStatus: CommentStatus.ACTIVE,
			},
			input,
			{
				new: true,
			},
		);
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
		return result;
	}

	public async getComments(memberId: ObjectId, input: CommentsInquiry): Promise<Comments> {
		const { commentRefId } = input.search;
		const match: T = { commentRefId: commentRefId, commentStatus: CommentStatus.ACTIVE };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		const result: Comments[] = await this.commentModule.aggregate([
			{ $match: match },
			{ $sort: sort },
			{
				$facet: {
					list: [
						{ $skip: (input.page - 1) * input.limit },
						{ $limit: input.limit },
						// meliked
						lookupMember,
						{ $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } },
					],
					metaCounter: [{ $count: 'total' }],
				},
			},
		]);
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	public async removeCommentByAdmin(commentId: ObjectId): Promise<Comment> {
		const result = await this.commentModule.findOneAndDelete(commentId);
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);
		return result;
	}
}
