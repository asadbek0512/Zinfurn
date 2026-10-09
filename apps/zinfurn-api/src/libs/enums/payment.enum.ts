import { registerEnumType } from '@nestjs/graphql';

export enum PaymentMethod {
	CARD = 'CARD', // demo karta formasi (haqiqiy to'lov yo'q)
	TOSS = 'TOSS', // Toss Payments (test rejim)
	PAYME = 'PAYME', // Payme Merchant API (kalit yo'q bo'lsa demo)
	CLICK = 'CLICK', // Click Shop API (kalit yo'q bo'lsa demo)
}
registerEnumType(PaymentMethod, { name: 'PaymentMethod' });

export enum PaymentStatus {
	UNPAID = 'UNPAID',
	PAID = 'PAID',
}
registerEnumType(PaymentStatus, { name: 'PaymentStatus' });
