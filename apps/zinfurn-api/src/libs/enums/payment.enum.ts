import { registerEnumType } from '@nestjs/graphql';

export enum PaymentMethod {
	CARD = 'CARD', // demo karta formasi (haqiqiy to'lov yo'q)
	TOSS = 'TOSS', // Toss Payments (test rejim)
}
registerEnumType(PaymentMethod, { name: 'PaymentMethod' });

export enum PaymentStatus {
	UNPAID = 'UNPAID',
	PAID = 'PAID',
}
registerEnumType(PaymentStatus, { name: 'PaymentStatus' });
