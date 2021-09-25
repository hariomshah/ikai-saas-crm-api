import { Module } from '@nestjs/common';
import { TransactionTypeMasterController } from './transaction-type-master.controller';
import { TransactionTypeMasterService } from './transaction-type-master.service';

@Module({
  controllers: [TransactionTypeMasterController],
  providers: [TransactionTypeMasterService]
})
export class TransactionTypeMasterModule {}
