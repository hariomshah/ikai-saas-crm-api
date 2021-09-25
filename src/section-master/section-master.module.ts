import { Module } from '@nestjs/common';
import { SectionMasterController } from './section-master.controller';
import { SectionMasterService } from './section-master.service';

@Module({
  controllers: [SectionMasterController],
  providers: [SectionMasterService]
})
export class SectionMasterModule {}
