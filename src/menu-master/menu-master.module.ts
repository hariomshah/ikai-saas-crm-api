import { Module } from '@nestjs/common';
import { MenuMasterController } from './menu-master.controller';
import { MenuMasterService } from './menu-master.service';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [AuthModule],
  controllers: [MenuMasterController],
  providers: [MenuMasterService]
})
export class MenuMasterModule {}
