import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from 'apps/zinfurn-api/src/libs/dto/member/member';
import { Product } from 'apps/zinfurn-api/src/libs/dto/product/product';
import { MemberStatus, MemberType } from 'apps/zinfurn-api/src/libs/enums/member.enum';
import { ProductStatus } from 'apps/zinfurn-api/src/libs/enums/product.enum';
import { AnyBulkWriteOperation, Model } from 'mongoose';
import { buildSaleWindow, isSaleActive, isSoldOut } from './lib/flashSale';

@Injectable()
export class BatchService {
  private readonly logger = new Logger(BatchService.name);

  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
    @InjectModel('Member') private readonly memberModel: Model<Member>,
  ) { }

  public async batchRollback(): Promise<void> {
    await this.productModel
      .updateMany(
        {
          productStatus: ProductStatus.ACTIVE,
        },
        { productRank: 0 },
      )
      .exec();

    await this.memberModel
      .updateMany(
        {
          memberStatus: MemberStatus.ACTIVE,
          memberType: MemberType.AGENT,
        },
        { memberRank: 0 },
      )
      .exec();
  }
  // arry ustida etereshin mezitini qo'layapmiz va map qo'lagan holda har bitta elementimizni qo'lga olayapmiz
  public async batchTopProducts(): Promise<void> {
    const products: Product[] = await this.productModel
      .find({
        productStatus: ProductStatus.ACTIVE,
        productRank: 0
      })
      .exec();

    const promisedList = products.map(async (ele: Product) => {
      const { _id, productLikes= 0, productViews } = ele;
      const rank = productLikes * 2 + productViews * 1;
      return await this.productModel.findByIdAndUpdate(_id, { productRank: rank });
    });
    await Promise.all(promisedList);
  }

  public async batchTopAgents(): Promise<void> {
    const agents: Member[] = await this.memberModel
      .find({
        memberType: MemberType.AGENT,
        memberStatus: MemberStatus.ACTIVE,
        memberRank: 0
      })
      .exec();

    const promisedList = agents.map(async (ele: Member) => {
      const { _id, memberProducts, memberLikes, memberArticles, memberViews } = ele;
      const rank = memberProducts * 5 + memberArticles * 3 + memberLikes * 2 + memberViews * 1;
      return await this.memberModel.findByIdAndUpdate(_id, { memberRank: rank });
    });
    await Promise.all(promisedList);
  }

  public getHello(): string {
    return 'Welcome to Zinfurn BATCH Server!';
  }

  /** Aksiyasi yo'q / tugagan / hali boshlanmagan ACTIVE mahsulotlarga darrov yangi aksiya beradi */
  public async batchFlashSales(): Promise<number> {
    const now = Date.now();
    const products = await this.productModel
      .find(
        { productStatus: ProductStatus.ACTIVE },
        { productPrice: 1, productSalePrice: 1, productIsOnSale: 1, productSaleStartsAt: 1, productSaleExpiresAt: 1, productInStock: 1, productStock: 1 },
      )
      .lean<Product[]>()
      .exec();

    const operations: AnyBulkWriteOperation<Product>[] = [];
    // Tugagan mahsulotga chegirma ko'rsatilmaydi — bor aksiyasi ham o'chiriladi
    const soldOut = products.filter((product) => isSoldOut(product) && product.productIsOnSale);
    soldOut.forEach((product) =>
      operations.push({ updateOne: { filter: { _id: product._id }, update: { $set: { productIsOnSale: false } } } }),
    );
    products
      .filter((product) => product.productPrice > 0 && !isSoldOut(product) && !isSaleActive(product, now))
      .forEach((product) => {
        const window = buildSaleWindow(product.productPrice, now);
        if (window) operations.push({ updateOne: { filter: { _id: product._id }, update: { $set: window } } });
      });

    if (operations.length) await this.productModel.bulkWrite(operations);
    this.logger.log(`Flash sale renewed: ${operations.length - soldOut.length} / ${products.length}, sold out cleared: ${soldOut.length}`);
    return operations.length;
  }
}
