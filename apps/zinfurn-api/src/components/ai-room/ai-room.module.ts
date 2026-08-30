import { Module } from '@nestjs/common';
import { AiRoomResolver } from './ai-room.resolver';
import { AiRoomService } from './ai-room.service';
import { AiQuotaService } from './ai-quota.service';
import { PropertyModule } from '../property/property.module';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [PropertyModule, AuthModule],
	providers: [AiRoomResolver, AiRoomService, AiQuotaService],
	exports: [AiRoomService],
})
export class AiRoomModule {}
