import { Module } from '@nestjs/common';
import { AppLayoutController } from './app-layout.controller';
import { AppLayoutService } from './app-layout.service';

@Module({
  controllers: [AppLayoutController],
  providers: [AppLayoutService]
})
export class AppLayoutModule {}
