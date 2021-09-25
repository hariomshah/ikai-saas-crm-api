import { Module } from '@nestjs/common';
import { LocationmasterController } from './locationmaster.controller';
import { LocationmasterService } from './locationmaster.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [LocationmasterController],
  providers: [LocationmasterService]
})
export class LocationmasterModule {}
