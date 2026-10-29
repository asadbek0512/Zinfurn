import { registerEnumType } from '@nestjs/graphql';

export enum RepairProductType {
	STOOL = 'STOOL',
	TABLE = 'TABLE',
	BED = 'BED',
	SOFA = 'SOFA',
	CABINET = 'CABINET',
	CHAIR = 'CHAIR',
	SHELF = 'SHELF',
	OTHER = 'OTHER',
}
registerEnumType(RepairProductType, {
	name: 'RepairProductType',
});

export enum RepairProductStatus {
	ACTIVE = 'ACTIVE',
	DELETE = 'DELETE',
    PAUSE = 'PAUSE',
}

registerEnumType(RepairProductStatus, {
	name: 'RepairProductStatus',
});