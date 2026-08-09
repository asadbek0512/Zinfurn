import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { GqlContextType, GqlExceptionFilter } from '@nestjs/graphql';

// GraphQL va HTTP so'rovlaridagi barcha kutilmagan xatolarni markazlashtirib log qiladi.
// Tashqi paket (Sentry va h.k.) kerak emas — mavjud NestJS Logger orqali ishlaydi,
// shuning uchun audit/vulnerability xavfi yo'q. DSN qo'shilganda shu joydan tashqi
// monitoring xizmatiga jo'natish oson qo'shiladi.
@Catch()
export class AllExceptionsFilter implements ExceptionFilter, GqlExceptionFilter {
	private readonly logger = new Logger('UnhandledException');

	public catch(exception: unknown, host: ArgumentsHost): unknown {
		const contextType = host.getType<GqlContextType>();
		const message = exception instanceof Error ? exception.stack ?? exception.message : String(exception);

		this.logger.error(`[${contextType}] ${message}`);

		// GraphQL xatolari Apollo formatiga qaytariladi — resolver'ga qaytib, standart
		// error response davom etadi; bu yerda faqat loglash sodir bo'ladi.
		throw exception;
	}
}
