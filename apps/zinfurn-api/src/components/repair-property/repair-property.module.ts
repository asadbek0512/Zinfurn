import { Module } from '@nestjs/common';
import { RepairPropertyService } from './repair-property.service';
import { RepairPropertyResolver } from './repair-property.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import RepairProperty from '../../schemas/RepairProperty';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';
import { MemberModule } from '../member/member.module';
import { LikeModule } from '../like/like.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'RepairProperty',
        schema: RepairProperty,
      },
    ]),
    AuthModule,
    ViewModule,
    MemberModule,
    LikeModule,
  ],

  providers: [RepairPropertyService, RepairPropertyResolver],
  exports: [RepairPropertyService]
})
export class RepairPropertyModule { }
