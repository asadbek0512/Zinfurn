import { Module, forwardRef } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { AiChatBotService } from './ai-chat-bot.service';
import { AuthModule } from '../components/auth/auth.module';
import { NotificationModule } from '../components/notification/notification.module';

@Module({
	providers: [SocketGateway, AiChatBotService],
	imports: [AuthModule, forwardRef(() => NotificationModule)],
	exports: [SocketGateway],
})
export class SocketModule {}
