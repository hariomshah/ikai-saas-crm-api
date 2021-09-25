import { Module } from '@nestjs/common';
import { SupplierMasterController } from './supplier-master.controller';
import { SupplierMasterService } from './supplier-master.service';

@Module({
  controllers: [SupplierMasterController],
  providers: [SupplierMasterService]
})
export class SupplierMasterModule {}
