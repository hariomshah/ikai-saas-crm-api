import { Module } from '@nestjs/common';
import { TablesMasterController } from './tables-master.controller';
import { TablesMasterService } from './tables-master.service';

@Module({
  controllers: [TablesMasterController],
  providers: [TablesMasterService]
})
export class TablesMasterModule {}
