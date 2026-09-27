import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppStat } from '../../libs/dto/app-stat/app-stat';
import { AppPlatform } from '../../libs/enums/app-stat.enum';

@Injectable()
export class AppStatService {
	constructor(@InjectModel('AppStat') private readonly appStatModel: Model<AppStat>) {}

	/** Ilova yuklab olinganini sanaydi — hujjat bo'lmasa upsert bilan yaratiladi */
	public async recordAppDownload(platform: AppPlatform): Promise<boolean> {
		await this.appStatModel.updateOne({ platform }, { $inc: { downloads: 1 } }, { upsert: true }).exec();
		return true;
	}

	public async getAppStats(): Promise<AppStat[]> {
		return await this.appStatModel.find().sort({ platform: 1 }).lean<AppStat[]>().exec();
	}
}
