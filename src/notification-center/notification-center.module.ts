import { Module, HttpModule } from '@nestjs/common';
import { NotificationCenterController } from './notification-center.controller';
import { NotificationCenterService } from './notification-center.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, HttpModule],
  controllers: [NotificationCenterController],
  providers: [NotificationCenterService]
})
export class NotificationCenterModule {}
