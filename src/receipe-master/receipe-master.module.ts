import { Module } from '@nestjs/common';
import { ReceipeMasterController } from './receipe-master.controller';
import { ReceipeMasterService } from './receipe-master.service';

@Module({
  controllers: [ReceipeMasterController],
  providers: [ReceipeMasterService]
})
export class ReceipeMasterModule {}
