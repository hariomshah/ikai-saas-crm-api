import { Module } from '@nestjs/common';
import { ManufacturermasterController } from './manufacturermaster.controller';
import { ManufacturermasterService } from './manufacturermaster.service';

@Module({
  controllers: [ManufacturermasterController],
  providers: [ManufacturermasterService]
})
export class ManufacturermasterModule {}
