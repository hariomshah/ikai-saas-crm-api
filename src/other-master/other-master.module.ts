import { Module } from '@nestjs/common';
import { OtherMasterController } from './other-master.controller';
import { OtherMasterService } from './other-master.service';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [AuthModule],
  controllers: [OtherMasterController],
  providers: [OtherMasterService]
})
export class OtherMasterModule {}
