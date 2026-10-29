import { Module } from '@nestjs/common';
import { RepairProductService } from './repair-product.service';
import { RepairProductResolver } from './repair-product.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import RepairProduct from '../../schemas/RepairProduct';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';
import { MemberModule } from '../member/member.module';
import { LikeModule } from '../like/like.module';
import { TranslationModule } from '../translation/translation.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'RepairProduct',
        schema: RepairProduct,
      },
    ]),
    AuthModule,
    ViewModule,
    MemberModule,
    LikeModule,
    TranslationModule,
  ],

  providers: [RepairProductService, RepairProductResolver],
  exports: [RepairProductService]
})
export class RepairProductModule { }
