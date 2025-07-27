import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { HelpController } from "./help.controller";
import { HelpService } from "./help.service";
// import { PassportModule } from '@nestjs/passport';
import { AuthModule } from "../auth/auth.module";

import { NotifyEventsService } from "../notify-events/notify-events.service";
import { NotifyEventsModule } from "../notify-events/notify-events.module";
import { NotifyEmailService } from "../notify-email/notify-email.service";
import { NotifySmsService } from "../notify-sms/notify-sms.service";
import { NotifyPushNotificationService } from "../notify-push-notification/notify-push-notification.service";

@Module({
  imports: [AuthModule, HttpModule, NotifyEventsModule],
  controllers: [HelpController],
  providers: [
    HelpService,
    NotifyEmailService,
    NotifySmsService,
    NotifyPushNotificationService,
    NotifyEventsService,
  ],
})
export class HelpModule {}
