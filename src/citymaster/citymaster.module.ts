import { Module } from '@nestjs/common';
import { CitymasterController } from './citymaster.controller';
import { CitymasterService } from './citymaster.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CitymasterController],
  providers: [CitymasterService]
})
export class CitymasterModule {}
