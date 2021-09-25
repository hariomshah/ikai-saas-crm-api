import { Module } from '@nestjs/common';
import { MenuvariationsMasterController } from './menuvariations-master.controller';
import { MenuvariationsMasterService } from './menuvariations-master.service';

@Module({
  controllers: [MenuvariationsMasterController],
  providers: [MenuvariationsMasterService]
})
export class MenuvariationsMasterModule {}
