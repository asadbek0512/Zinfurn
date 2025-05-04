import { registerEnumType } from '@nestjs/graphql';

export enum PropertyType {
	STOOL = 'STOOL',
	TABLE = 'TABLE',
	BED = 'BED',
	SOFA = 'SOFA',
	CABINET = 'CABINET',
	CHAIR = 'CHAIR',
	SHELF = 'SHELF',
	OTHER = 'OTHER',
}
registerEnumType(PropertyType, {
	name: 'PropertyType',
});

export enum PropertyStatus {
	HOLD = 'HOLD',
	ACTIVE = 'ACTIVE',
	SOLD = 'SOLD',
	DELETED = 'DELETED',
}
registerEnumType(PropertyStatus, {
	name: 'PropertyStatus',
});

export enum PropertyCategory {
	HOME = 'HOME',
	OFFICE = 'OFFICE',
	OUTDOOR = 'OUTDOOR',
	KITCHEN = 'KITCHEN',
	BATHROOM = 'BATHROOM',
}
registerEnumType(PropertyCategory, {
	name: 'PropertyCategory',
});

export enum PropertyMaterial {
	WOOD = 'WOOD',
	METAL = 'METAL',
	PLASTIC = 'PLASTIC'
}
registerEnumType(PropertyMaterial, {
	name: 'PropertyMaterial',
});

export enum PropertyColor {
	WHITE = 'WHITE',
	BLACK = 'BLACK',
	BROWN = 'BROWN',
	GRAY = 'GRAY',
	BEIGE = 'BEIGE',
	BLUE = 'BLUE',
	GREEN = 'GREEN',
}
registerEnumType(PropertyColor, {
	name: 'PropertyColor',
});

export enum PropertyCondition {
	NEW = 'NEW',
	USED = 'USED',
}
registerEnumType(PropertyCondition, {
	name: 'PropertyCondition',
});
