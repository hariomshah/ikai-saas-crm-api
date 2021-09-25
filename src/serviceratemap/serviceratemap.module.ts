import { Module } from '@nestjs/common';
import { ServiceratemapController } from './serviceratemap.controller';
import { ServiceratemapService } from './serviceratemap.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ServiceratemapController],
  providers: [ServiceratemapService]
})
export class ServiceratemapModule {}
