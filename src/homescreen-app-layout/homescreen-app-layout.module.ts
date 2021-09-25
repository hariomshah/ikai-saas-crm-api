import { Module } from '@nestjs/common';
import { HomescreenAppLayoutController } from './homescreen-app-layout.controller';
import { HomescreenAppLayoutService } from './homescreen-app-layout.service';

@Module({
  controllers: [HomescreenAppLayoutController],
  providers: [HomescreenAppLayoutService]
})
export class HomescreenAppLayoutModule {}
