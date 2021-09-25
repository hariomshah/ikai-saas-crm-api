import { Module } from '@nestjs/common';
import { CountryMasterController } from './country-master.controller';
import { CountryMasterService } from './country-master.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CountryMasterController],
  providers: [CountryMasterService]
})
export class CountryMasterModule {}
