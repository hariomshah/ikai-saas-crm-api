import { Module } from '@nestjs/common';
import { CategorymasterController } from './categorymaster.controller';
import { CategorymasterService } from './categorymaster.service';

@Module({
  controllers: [CategorymasterController],
  providers: [CategorymasterService]
})
export class CategorymasterModule {}
