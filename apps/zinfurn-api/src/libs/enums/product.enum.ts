import { registerEnumType } from '@nestjs/graphql';

export enum ProductType {
	STOOL = 'STOOL',
	TABLE = 'TABLE',
	BED = 'BED',
	SOFA = 'SOFA',
	CABINET = 'CABINET',
	CHAIR = 'CHAIR',
	SHELF = 'SHELF',
	OTHER = 'OTHER',
}
registerEnumType(ProductType, {
	name: 'ProductType',
});

export enum ProductStatus {
	HOLD = 'HOLD',
	ACTIVE = 'ACTIVE',
	SOLD = 'SOLD',
	DELETE = 'DELETE',
}
registerEnumType(ProductStatus, {
	name: 'ProductStatus',
});

export enum ProductCategory {
	HOME = 'HOME',
	OFFICE = 'OFFICE',
	OUTDOOR = 'OUTDOOR',
	KITCHEN = 'KITCHEN',
	BATHROOM = 'BATHROOM',
}
registerEnumType(ProductCategory, {
	name: 'ProductCategory',
});

export enum ProductMaterial {
	WOOD = 'WOOD',
	METAL = 'METAL',
	PLASTIC = 'PLASTIC',
	GLASS = "GLASS"
}
registerEnumType(ProductMaterial, {
	name: 'ProductMaterial',
});

export enum ProductColor {
	WHITE = 'WHITE',
	BLACK = 'BLACK',
	BROWN = 'BROWN',
	GRAY = 'GRAY',
	BEIGE = 'BEIGE',
	BLUE = 'BLUE',
	GREEN = 'GREEN',
}
registerEnumType(ProductColor, {
	name: 'ProductColor',
});

export enum ProductCondition {
	NEW = 'NEW',
	USED = 'USED',
}
registerEnumType(ProductCondition, {
	name: 'ProductCondition',
});
