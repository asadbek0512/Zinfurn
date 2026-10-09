import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SellerTopProduct {
	@Field(() => String)
	propertyId: string;

	@Field(() => String)
	propertyTitle: string;

	@Field(() => String, { nullable: true })
	propertyImage?: string;

	@Field(() => Int)
	soldQty: number;

	@Field(() => Float)
	revenue: number;
}

@ObjectType()
export class SellerTrendPoint {
	/** YYYY-MM-DD */
	@Field(() => String)
	date: string;

	@Field(() => Float)
	revenue: number;

	@Field(() => Int)
	orders: number;
}

@ObjectType()
export class SellerDashboard {
	/** Faqat to'langan (PAID), bekor qilinmagan buyurtmalardan */
	@Field(() => Float)
	totalRevenue: number;

	@Field(() => Int)
	totalOrders: number;

	@Field(() => Int)
	itemsSold: number;

	@Field(() => Int)
	activeListings: number;

	@Field(() => Int)
	soldListings: number;

	@Field(() => Int)
	totalListings: number;

	@Field(() => Int)
	totalViews: number;

	@Field(() => Int)
	totalLikes: number;

	@Field(() => [SellerTopProduct])
	topProducts: SellerTopProduct[];

	/** Oxirgi 7 kunlik kunlik daromad (chart uchun) */
	@Field(() => [SellerTrendPoint])
	salesTrend: SellerTrendPoint[];
}
