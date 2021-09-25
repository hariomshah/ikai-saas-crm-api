import { Module, HttpModule } from "@nestjs/common";
import { NotifyEventsController } from "./notify-events.controller";
import { NotifyEventsService } from "./notify-events.service";

import { NotifyEmailService } from "../notify-email/notify-email.service";
import { NotifySmsService } from "../notify-sms/notify-sms.service";
import { NotifyPushNotificationService } from "../notify-push-notification/notify-push-notification.service";

@Module({
  imports: [HttpModule],
  controllers: [NotifyEventsController],
  providers: [
    NotifyEventsService,
    NotifyEmailService,
    NotifySmsService,
    NotifyPushNotificationService,
  ],
})
export class NotifyEventsModule {}
