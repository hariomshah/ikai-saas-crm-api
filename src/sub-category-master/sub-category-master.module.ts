import { Module } from '@nestjs/common';
import { SubCategoryMasterController } from './sub-category-master.controller';
import { SubCategoryMasterService } from './sub-category-master.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [SubCategoryMasterController],
  providers: [SubCategoryMasterService]
})
export class SubCategoryMasterModule {}
