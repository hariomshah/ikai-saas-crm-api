import { Module } from '@nestjs/common';
import { ItemMasterController } from './item-master.controller';
import { ItemMasterService } from './item-master.service';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [AuthModule],
  controllers: [ItemMasterController],
  providers: [ItemMasterService]
})
export class ItemMasterModule {}
