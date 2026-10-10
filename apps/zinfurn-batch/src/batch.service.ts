import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from 'apps/zinfurn-api/src/libs/dto/member/member';
import { Property } from 'apps/zinfurn-api/src/libs/dto/property/property';
import { MemberStatus, MemberType } from 'apps/zinfurn-api/src/libs/enums/member.enum';
import { PropertyStatus } from 'apps/zinfurn-api/src/libs/enums/property.enum';
import { AnyBulkWriteOperation, Model } from 'mongoose';
import { buildSaleWindow, isSaleActive, isSoldOut } from './lib/flashSale';

@Injectable()
export class BatchService {
  private readonly logger = new Logger(BatchService.name);

  constructor(
    @InjectModel('Property') private readonly propertyModel: Model<Property>,
    @InjectModel('Member') private readonly memberModel: Model<Member>,
  ) { }

  public async batchRollback(): Promise<void> {
    await this.propertyModel
      .updateMany(
        {
          propertyStatus: PropertyStatus.ACTIVE,
        },
        { propertyRank: 0 },
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
  public async batchTopProperties(): Promise<void> {
    const properties: Property[] = await this.propertyModel
      .find({
        propertyStatus: PropertyStatus.ACTIVE,
        propertyRank: 0
      })
      .exec();

    const promisedList = properties.map(async (ele: Property) => {
      const { _id, propertyLikes= 0, propertyViews } = ele;
      const rank = propertyLikes * 2 + propertyViews * 1;
      return await this.propertyModel.findByIdAndUpdate(_id, { propertyRank: rank });
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
      const { _id, memberProperties, memberLikes, memberArticles, memberViews } = ele;
      const rank = memberProperties * 5 + memberArticles * 3 + memberLikes * 2 + memberViews * 1;
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
    const properties = await this.propertyModel
      .find(
        { propertyStatus: PropertyStatus.ACTIVE },
        { propertyPrice: 1, propertySalePrice: 1, propertyIsOnSale: 1, propertySaleStartsAt: 1, propertySaleExpiresAt: 1, propertyInStock: 1, propertyStock: 1 },
      )
      .lean<Property[]>()
      .exec();

    const operations: AnyBulkWriteOperation<Property>[] = [];
    // Tugagan mahsulotga chegirma ko'rsatilmaydi — bor aksiyasi ham o'chiriladi
    const soldOut = properties.filter((property) => isSoldOut(property) && property.propertyIsOnSale);
    soldOut.forEach((property) =>
      operations.push({ updateOne: { filter: { _id: property._id }, update: { $set: { propertyIsOnSale: false } } } }),
    );
    properties
      .filter((property) => property.propertyPrice > 0 && !isSoldOut(property) && !isSaleActive(property, now))
      .forEach((property) => {
        const window = buildSaleWindow(property.propertyPrice, now);
        if (window) operations.push({ updateOne: { filter: { _id: property._id }, update: { $set: window } } });
      });

    if (operations.length) await this.propertyModel.bulkWrite(operations);
    this.logger.log(`Flash sale renewed: ${operations.length - soldOut.length} / ${properties.length}, sold out cleared: ${soldOut.length}`);
    return operations.length;
  }
}
