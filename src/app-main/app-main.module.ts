import { Module } from '@nestjs/common';
import { AppMainController } from './app-main.controller';
import { AppMainService } from './app-main.service';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [AuthModule],
  controllers: [AppMainController],
  providers: [AppMainService]
})
export class AppMainModule {}
