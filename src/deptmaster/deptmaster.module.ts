import { Module } from '@nestjs/common';
import { DeptmasterController } from './deptmaster.controller';
import { DeptmasterService } from './deptmaster.service';

@Module({
  controllers: [DeptmasterController],
  providers: [DeptmasterService]
})
export class DeptmasterModule {}
