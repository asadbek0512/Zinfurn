import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import PushDeviceSchema from '../../schemas/PushDevice.model';
import { AuthModule } from '../auth/auth.module';
import { PushResolver } from './push.resolver';
import { PushService } from './push.service';

/** Global: notification, order, member modullari import qilmasdan PushService'ni oladi */
@Global()
@Module({
	imports: [MongooseModule.forFeature([{ name: 'PushDevice', schema: PushDeviceSchema }]), AuthModule],
	providers: [PushResolver, PushService],
	exports: [PushService],
})
export class PushModule {}
