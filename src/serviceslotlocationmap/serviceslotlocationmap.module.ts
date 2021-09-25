import { Module } from '@nestjs/common';
import { ServiceslotlocationmapController } from './serviceslotlocationmap.controller';
import { ServiceslotlocationmapService } from './serviceslotlocationmap.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ServiceslotlocationmapController],
  providers: [ServiceslotlocationmapService]
})
export class ServiceslotlocationmapModule {}
