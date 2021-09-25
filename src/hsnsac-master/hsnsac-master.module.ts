import { Module } from '@nestjs/common';
import { HsnsacMasterController } from './hsnsac-master.controller';
import { HsnsacMasterService } from './hsnsac-master.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [HsnsacMasterController],
  providers: [HsnsacMasterService]
})
export class HsnsacMasterModule {}
