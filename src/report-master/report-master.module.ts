import { Module } from '@nestjs/common';
import { ReportMasterController } from './report-master.controller';
import { ReportMasterService } from './report-master.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  
  imports: [AuthModule],
  controllers: [ReportMasterController],
  providers: [ReportMasterService]
})
export class ReportMasterModule {}
