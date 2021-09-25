import { Module } from '@nestjs/common';
import { StateMasterController } from './state-master.controller';
import { StateMasterService } from './state-master.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [StateMasterController],
  providers: [StateMasterService]
})
export class StateMasterModule {}
