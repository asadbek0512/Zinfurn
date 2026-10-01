import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { PushPlatform } from '../../libs/enums/push.enum';
import { PushTokenInput } from '../../libs/dto/push/push.input';
import { ApnsSender, FcmSender, InvalidPushTokenError, PushMessage } from './push.senders';

interface PushDevice {
	_id: ObjectId;
	pushToken: string;
	pushPlatform: PushPlatform;
}

/** Push matni qisqa bo'lsin — lock screen'da kesiladi */
const PUSH_BODY_MAX = 180;

@Injectable()
export class PushService {
	private readonly logger = new Logger(PushService.name);
	private readonly fcm = new FcmSender();
	private readonly apns = new ApnsSender();

	constructor(@InjectModel('PushDevice') private readonly pushDeviceModel: Model<PushDevice>) {
		this.logger.log(`push providers — fcm: ${this.fcm.enabled}, apns: ${this.apns.enabled}`);
	}

	/** Token boshqa akkauntda bo'lsa (qurilmada user almashgan) — yangi egasiga o'tadi */
	public async registerToken(memberId: ObjectId, input: PushTokenInput): Promise<boolean> {
		await this.pushDeviceModel
			.updateOne(
				{ pushToken: input.pushToken },
				{ $set: { memberId, pushPlatform: input.pushPlatform } },
				{ upsert: true },
			)
			.exec();
		return true;
	}

	public async unregisterToken(pushToken: string): Promise<boolean> {
		await this.pushDeviceModel.deleteOne({ pushToken }).exec();
		return true;
	}

	public async removeMemberDevices(memberId: ObjectId): Promise<void> {
		await this.pushDeviceModel.deleteMany({ memberId }).exec();
	}

	/** Fire-and-forget: xato bo'lsa log qilinadi, asosiy oqim to'xtamaydi */
	public sendToMember(memberId: ObjectId | string, message: PushMessage): void {
		this.deliver(memberId, { ...message, body: message.body.slice(0, PUSH_BODY_MAX) }).catch((err) =>
			this.logger.warn(`push failed: ${err instanceof Error ? err.message : err}`),
		);
	}

	private async deliver(memberId: ObjectId | string, message: PushMessage): Promise<void> {
		if (!this.fcm.enabled && !this.apns.enabled) return;
		const devices = await this.pushDeviceModel.find({ memberId }).lean<PushDevice[]>().exec();
		await Promise.all(
			devices.map(async (device) => {
				const sender = device.pushPlatform === PushPlatform.IOS ? this.apns : this.fcm;
				try {
					await sender.send(device.pushToken, message);
				} catch (err) {
					if (err instanceof InvalidPushTokenError) {
						await this.pushDeviceModel.deleteOne({ _id: device._id }).exec();
						return;
					}
					this.logger.warn(`push to ${device.pushPlatform} failed: ${err instanceof Error ? err.message : err}`);
				}
			}),
		);
	}
}
