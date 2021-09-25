import { Module } from '@nestjs/common';
import { CompmainController } from './compmain.controller';
import { CompmainService } from './compmain.service';

@Module({
  controllers: [CompmainController],
  providers: [CompmainService]
})
export class CompmainModule {}
