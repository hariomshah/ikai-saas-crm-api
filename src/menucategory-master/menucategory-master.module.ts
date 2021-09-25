import { Module } from '@nestjs/common';
import { MenucategoryMasterController } from './menucategory-master.controller';
import { MenucategoryMasterService } from './menucategory-master.service';

@Module({
  controllers: [MenucategoryMasterController],
  providers: [MenucategoryMasterService]
})
export class MenucategoryMasterModule {}
