import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from '../product/product';
import { ProductCategory, ProductColor, ProductMaterial, ProductType } from '../../enums/product.enum';

@ObjectType()
export class RoomAnalysisResult {
	@Field(() => ProductCategory, { nullable: true })
	roomType?: ProductCategory;

	@Field(() => ProductType, { nullable: true })
	requestedType?: ProductType; // foydalanuvchi matnidan aniqlangan mahsulot turi (masalan BED)

	@Field(() => [ProductColor])
	dominantColors: ProductColor[];

	@Field(() => ProductMaterial, { nullable: true })
	suggestedMaterial?: ProductMaterial;

	@Field(() => String)
	styleNotes: string;

	@Field(() => [Product])
	matchedProducts: Product[];
}

@ObjectType()
export class GeneratedRoomImage {
	@Field(() => String)
	imageBase64: string;

	@Field(() => String)
	mimeType: string;
}
