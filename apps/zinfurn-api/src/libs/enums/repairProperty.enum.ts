import { registerEnumType } from '@nestjs/graphql';

export enum RepairPropertyType {
	STOOL = 'STOOL',
	TABLE = 'TABLE',
	BED = 'BED',
	SOFA = 'SOFA',
	CABINET = 'CABINET',
	CHAIR = 'CHAIR',
	SHELF = 'SHELF',
	OTHER = 'OTHER',
}
registerEnumType(RepairPropertyType, {
	name: 'RepairPropertyType',
});

export enum RepairPropertyStatus {
	ACTIVE = 'ACTIVE',
	DELETE = 'DELETE',
    PAUSE = 'PAUSE',
}

registerEnumType(RepairPropertyStatus, {
	name: 'RepairPropertyStatus',
});