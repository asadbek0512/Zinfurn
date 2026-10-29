import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import {
    AgentProductsInquiry,
    AllProductsInquiry,
    OrdinaryInquiry,
    ProductsInquiry,
    ProductInput
} from '../../libs/dto/product/product.input';
import { Products, Product } from '../../libs/dto/product/product';
import { Direction, Message } from '../../libs/enums/common_enum';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { ProductStatus } from '../../libs/enums/product.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { ProductUpdate } from '../../libs/dto/product/product.update';
import * as moment from 'moment'
import { ShapeIntoMongoObjectId, buildSearchRegex, lookupAuthMemberLiked, lookupMember } from '../../libs/config';
import { LikeInput } from '../../libs/dto/like/like.input';
import { LikeGroup } from '../../libs/enums/like.enum';
import { LikeService } from '../like/like.service';
import { TranslationService } from '../translation/translation.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationGroup, NotificationType } from '../../libs/enums/notification.enum';

type PricedProduct = Pick<
    Product,
    'productPrice' | 'productSalePrice' | 'productIsOnSale' | 'productSaleStartsAt' | 'productSaleExpiresAt'
>;

/** Mijoz hozir ko'radigan narx — saytdagi activeSalePrice bilan bir xil qoida */
const effectivePrice = (p: PricedProduct, now = new Date()): number => {
    const saleActive =
        p.productIsOnSale &&
        typeof p.productSalePrice === 'number' &&
        p.productSalePrice < p.productPrice &&
        (!p.productSaleStartsAt || new Date(p.productSaleStartsAt) <= now) &&
        (!p.productSaleExpiresAt || new Date(p.productSaleExpiresAt) > now);
    return saleActive ? (p.productSalePrice as number) : p.productPrice;
};

@Injectable()
export class ProductService {
    constructor(
        @InjectModel('Product') private readonly productModel: Model<Product>,
        private memberService: MemberService,
        private viewService: ViewService,
        private likeService: LikeService,
        private translationService: TranslationService,
        private notificationService: NotificationService,
    ) { }

    /** Narx tushsa mahsulotni yoqtirganlarga bildirishnoma + push (xato bo'lsa update'ni buzmaydi) */
    private async notifyPriceDrop(before: PricedProduct | null, after: Product): Promise<void> {
        if (!before) return;
        const oldPrice = effectivePrice(before);
        const newPrice = effectivePrice(after);
        if (newPrice >= oldPrice) return;
        try {
            const likerIds = await this.likeService.findLikerIds(LikeGroup.PRODUCT, after._id);
            const ownerId = after.memberId.toString();
            await Promise.all(
                likerIds
                    .filter((id) => id !== ownerId)
                    .map((receiverId) =>
                        this.notificationService.createNotification({
                            notificationType: NotificationType.PRICE_DROP,
                            notificationGroup: NotificationGroup.PRODUCT,
                            notificationTitle: 'Price drop',
                            notificationDesc: `"${after.productTitle}" is now $${newPrice} (was $${oldPrice})`,
                            authorId: ownerId,
                            receiverId,
                            productId: after._id.toString(),
                        }),
                    ),
            );
        } catch (err) {
            Logger.warn(`Price drop notification failed: ${err.message}`);
        }
    }

    private findPricing(search: T): Promise<PricedProduct | null> {
        return this.productModel
            .findOne(search, {
                productPrice: 1,
                productSalePrice: 1,
                productIsOnSale: 1,
                productSaleStartsAt: 1,
                productSaleExpiresAt: 1,
            })
            .lean()
            .exec();
    }

    public async createProduct(input: ProductInput): Promise<Product> {
        try {
            const productData: T = {
                ...input,
                productInStock: true,     // Majburiy true qilamiz
            };

            // Tarjima (NON-BLOCKING: xato/sekin bo'lsa ham product baribir saqlanadi)
            try {
                const translations = await this.translationService.translateProduct(
                    input.productTitle,
                    input.productDesc,
                );
                if (translations) productData.productTranslations = translations;
            } catch (e) {
                Logger.warn('Tarjima o\'tkazib yuborildi (create)');
            }

            const result = await this.productModel.create(productData);
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

    public async getProduct(memberId: ObjectId, productId: ObjectId): Promise<Product> {
        const search: T = {
            _id: productId,
            productStatus: ProductStatus.ACTIVE,
        };

        const targetProduct: Product | null = await this.productModel.findOne(search).lean().exec();
        if (!targetProduct) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        if (memberId) {
            const viewInput = { memberId: memberId, viewRefId: productId, viewGroup: ViewGroup.PRODUCT };
            const newView = await this.viewService.recordView(viewInput);
            if (newView) {
                await this.productStatsEditor({ _id: productId, targetKey: 'productViews', modifier: 1 });
                targetProduct.productViews++;
            }
            // melicked
            const LikeInput = { memberId: memberId, likeRefId: productId, likeGroup: LikeGroup.PRODUCT };
            targetProduct.meLiked = await this.likeService.checkLikeExistence(LikeInput)
        }

        targetProduct.memberData = await this.memberService.getMember(null, targetProduct.memberId);
        return targetProduct;
    }

    public async updateProduct(memberId: ObjectId, input: ProductUpdate): Promise<Product> {
        let { productStatus, soldAt, deletedAt } = input;
        const search: T = {
            _id: input._id,
            memberId: memberId,
            productStatus: ProductStatus.ACTIVE,
        };

        if (productStatus === ProductStatus.SOLD) soldAt = moment().toDate();
        else if (productStatus === ProductStatus.DELETE) deletedAt = moment().toDate();

        // Nom yoki description o'zgarsa — qayta tarjima (NON-BLOCKING)
        if (input.productTitle !== undefined || input.productDesc !== undefined) {
            try {
                const existing: Product | null = await this.productModel.findOne(search).lean().exec();
                const title = input.productTitle ?? existing?.productTitle;
                const desc = input.productDesc ?? existing?.productDesc;
                if (title) {
                    const translations = await this.translationService.translateProduct(title, desc);
                    if (translations) (input as T).productTranslations = translations;
                }
            } catch (e) {
                Logger.warn('Tarjima o\'tkazib yuborildi (update)');
            }
        }

        const before = await this.findPricing(search);
        const result = await this.productModel
            .findOneAndUpdate(search, input, {
                new: true,
            })
            .exec();
        if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
        this.notifyPriceDrop(before, result);

        if (soldAt || deletedAt) {
            await this.memberService.memberStatsEditor({
                _id: memberId,
                targetKey: 'memberProducts',
                modifier: -1,
            });
        }

        return result;
    }

    public async getProducts(memberId: ObjectId, input: ProductsInquiry): Promise<Products> {
        const match: T = { productStatus: ProductStatus.ACTIVE };
        const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

        this.shapeMatchQuery(match, input);

        const result = await this.productModel
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
    private shapeMatchQuery(match: T, input: ProductsInquiry): void {
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
            productIsOnSale,
            idList,
        } = input.search;

        if (idList && idList.length) match._id = { $in: idList.map((id) => ShapeIntoMongoObjectId(id)) };

        // Flash Sale: sale oynasi ochilgan va muddati o'tmagan mahsulotlar.
        // productSaleStartsAt yo'q bo'lsa — eski yozuv, darrov aktiv hisoblanadi.
        if (productIsOnSale) {
            const now = new Date();
            match.productIsOnSale = true;
            match.productSaleExpiresAt = { $gt: now };
            // $or emas, $and ichida — pastdagi `options` filtri $or'ni o'zi band qiladi
            match.$and = [{ $or: [{ productSaleStartsAt: { $lte: now } }, { productSaleStartsAt: null }] }];
        }

        if (memberId) match.memberId = ShapeIntoMongoObjectId(memberId);
        if (categoryList && categoryList.length) match.productCategory = { $in: categoryList };
        if (typeList && typeList.length) match.productType = { $in: typeList };
        if (conditionList && conditionList.length) match.productCondition = { $in: conditionList };
        if (materialList && materialList.length) match.productMaterial = { $in: materialList };
        if (colorList && colorList.length) match.productColor = { $in: colorList };

        if (pricesRange) {
            match.productPrice = { $gte: pricesRange.start, $lte: pricesRange.end };
        }

        if (text) {
            match.productTitle = buildSearchRegex(text);
        }

        if (options && options.length) {
            match['$or'] = options.map((ele) => ({ [ele]: true }));
        }
    }

    public async getFavorites(memberId: ObjectId, input: OrdinaryInquiry): Promise<Products> {
        return await this.likeService.getFavoriteProducts(memberId, input);
    }

    public async getVisited(memberId: ObjectId, input: OrdinaryInquiry): Promise<Products> {
        return await this.viewService.getVisitedProducts(memberId, input);
    }

    public async getAgentProducts(memberId: ObjectId, input: AgentProductsInquiry): Promise<Products> {
        const { productStatus } = input.search;
        if (productStatus === ProductStatus.DELETE) throw new BadRequestException(Message.NOT_ALLOWED_REQUEST);

        const match: T = {
            memberId: memberId,
            productStatus: productStatus ?? { $ne: ProductStatus.DELETE },
        };
        const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

        const result = await this.productModel
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

    public async likeTargetProduct(memberId: ObjectId, likeRefId: ObjectId): Promise<Product> {
        const target: Product | null = await this.productModel
            .findOne({ _id: likeRefId, productStatus: ProductStatus.ACTIVE })
            .exec();
        if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        const input: LikeInput = {
            memberId: memberId,
            likeRefId: likeRefId,
            likeGroup: LikeGroup.PRODUCT
        }

        const modifier: number = await this.likeService.toggleLike(input)
        const result = await this.productStatsEditor({ _id: likeRefId, targetKey: 'productLikes', modifier: modifier });

        if (!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
        return result;
    }

    public async getAllProductsByAdmin(input: AllProductsInquiry): Promise<Products> {
        const { productStatus, productCategory } = input.search;
        const match: T = {};
        const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

        if (productStatus) match.productStatus = productStatus;
        if (productCategory) match.productLocation = { $in: productCategory };

        const result = await this.productModel
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

    public async updateProductByAdmin(input: ProductUpdate): Promise<Product> {
        let { productStatus, soldAt, deletedAt } = input;
        const search: T = {
            _id: input._id,
            productStatus: ProductStatus.ACTIVE,
        };

        if (productStatus === ProductStatus.SOLD) soldAt = moment().toDate();
        else if (productStatus === ProductStatus.DELETE) deletedAt = moment().toDate();

        const before = await this.findPricing(search);
        const result = await this.productModel
            .findOneAndUpdate(search, input, {
                new: true,
            })
            .exec();
        if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
        this.notifyPriceDrop(before, result);

        if (soldAt || deletedAt) {
            await this.memberService.memberStatsEditor({
                _id: result.memberId,
                targetKey: 'memberProducts',
                modifier: -1,
            });
        }

        return result;
    }

    public async removeProductByAdmin(productId: ObjectId): Promise<Product> {
        const search: T = { _id: productId, productStatus: ProductStatus.DELETE };
        const result = await this.productModel.findOneAndDelete(search).exec();
        if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

        return result;
    }

    public async productStatsEditor(input: StatisticModifier): Promise<Product | null> {
        const { _id, targetKey, modifier } = input;
        return await this.productModel
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