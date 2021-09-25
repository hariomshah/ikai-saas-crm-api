import { Module } from '@nestjs/common';
import { TaxMasterController } from './tax-master.controller';
import { TaxMasterService } from './tax-master.service';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [AuthModule],
  controllers: [TaxMasterController],
  providers: [TaxMasterService]
})
export class TaxMasterModule {}
