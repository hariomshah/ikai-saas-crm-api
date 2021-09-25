import { Module } from '@nestjs/common';
import { BranchmasterController } from './branchmaster.controller';
import { BranchmasterService } from './branchmaster.service';

@Module({
  controllers: [BranchmasterController],
  providers: [BranchmasterService]
})
export class BranchmasterModule {}
