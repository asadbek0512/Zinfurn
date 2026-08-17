import { Field, ObjectType } from '@nestjs/graphql';
import { Property } from '../property/property';
import { PropertyCategory, PropertyColor, PropertyMaterial, PropertyType } from '../../enums/property.enum';

@ObjectType()
export class RoomAnalysisResult {
	@Field(() => PropertyCategory, { nullable: true })
	roomType?: PropertyCategory;

	@Field(() => PropertyType, { nullable: true })
	requestedType?: PropertyType; // foydalanuvchi matnidan aniqlangan mahsulot turi (masalan BED)

	@Field(() => [PropertyColor])
	dominantColors: PropertyColor[];

	@Field(() => PropertyMaterial, { nullable: true })
	suggestedMaterial?: PropertyMaterial;

	@Field(() => String)
	styleNotes: string;

	@Field(() => [Property])
	matchedProducts: Property[];
}
