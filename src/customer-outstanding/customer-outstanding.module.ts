import { Module } from '@nestjs/common';
import { CustomerOutstandingService } from './customer-outstanding.service';
import { CustomerOutstandingController } from './customer-outstanding.controller';

@Module({
  providers: [CustomerOutstandingService],
  controllers: [CustomerOutstandingController]
})
export class CustomerOutstandingModule {}
