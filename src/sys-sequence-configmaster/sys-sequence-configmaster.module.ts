import { Module } from '@nestjs/common';
import { SysSequenceConfigmasterController } from './sys-sequence-configmaster.controller';
import { SysSequenceConfigmasterService } from './sys-sequence-configmaster.service';

@Module({
  controllers: [SysSequenceConfigmasterController],
  providers: [SysSequenceConfigmasterService]
})
export class SysSequenceConfigmasterModule {}
