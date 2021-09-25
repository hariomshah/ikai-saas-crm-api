import { Module } from '@nestjs/common';
import { ClassMasterController } from './class-master.controller';
import { ClassMasterService } from './class-master.service';

@Module({
  controllers: [ClassMasterController],
  providers: [ClassMasterService]
})
export class ClassMasterModule {}
