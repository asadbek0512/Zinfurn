import { Module } from '@nestjs/common';
import { MemberResolver } from './member.resolver';
import { MemberService } from './member.service';
import { MongooseModule } from '@nestjs/mongoose';
import MemberSchema from '../../schemas/Member.model';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';
import { LikeModule } from '../like/like.module';
import FollowSchema from '../../schemas/Follow.model';
import PropertySchema from '../../schemas/Property.model';
import RepairSchema from '../../schemas/RepairProperty';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
    MongooseModule.forFeature([{ name: 'Follow', schema: FollowSchema }]),
    MongooseModule.forFeature([
      { name: 'Property', schema: PropertySchema },
      { name: 'RepairProperty', schema: RepairSchema },
    ]),
    AuthModule,
    ViewModule,
    LikeModule,
  ],
  providers: [MemberResolver, MemberService],
  exports: [MemberService]
})
export class MemberModule { }

//// circular dependency between modules. Use forwardRef()