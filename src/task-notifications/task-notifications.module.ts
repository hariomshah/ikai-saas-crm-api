import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TaskNotificationsService } from "./task-notifications.service";
import { VersioningService } from "./versioning.service";
import { NotifyEmailService } from "../notify-email/notify-email.service";
import { NotifySmsService } from "../notify-sms/notify-sms.service";
import { NotifyPushNotificationService } from "../notify-push-notification/notify-push-notification.service";

@Module({
  imports: [HttpModule],
  providers: [
    VersioningService,
    TaskNotificationsService,
    NotifyEmailService,
    NotifySmsService,
    NotifyPushNotificationService,
  ],
})
export class TaskNotificationsModule {}
