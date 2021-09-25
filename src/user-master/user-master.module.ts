import { Module } from '@nestjs/common';
import { UserMasterController } from './user-master.controller';
import {UserMasterService} from './user-master.service';
import { AuthModule } from '../auth/auth.module';



@Module({
  imports: [AuthModule],
  controllers: [UserMasterController],
  providers: [UserMasterService]
})
export class UserMasterModule {}
