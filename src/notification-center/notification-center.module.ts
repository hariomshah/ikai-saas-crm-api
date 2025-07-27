import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NotificationCenterController } from './notification-center.controller';
import { NotificationCenterService } from './notification-center.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, HttpModule],
  controllers: [NotificationCenterController],
  providers: [NotificationCenterService]
})
export class NotificationCenterModule {}
