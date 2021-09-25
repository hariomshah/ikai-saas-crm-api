import { Module, HttpModule } from "@nestjs/common";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { NotifyEventsService } from "../notify-events/notify-events.service";
import { NotifyEventsModule } from "../notify-events/notify-events.module";
import { AuthModule } from "../auth/auth.module";
import { NotifyEmailService } from "../notify-email/notify-email.service";
import { NotifySmsService } from "../notify-sms/notify-sms.service";
import { NotifyPushNotificationService } from "../notify-push-notification/notify-push-notification.service";
import { RecieptService } from "../reciept/reciept.service";
import { RecieptModule } from "../reciept/reciept.module";
import { SysSequenceConfigmasterService } from "src/sys-sequence-configmaster/sys-sequence-configmaster.service";
@Module({
  imports: [AuthModule, HttpModule, NotifyEventsModule, RecieptModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    NotifyEmailService,
    NotifySmsService,
    NotifyPushNotificationService,
    NotifyEventsService,
    RecieptService,
    SysSequenceConfigmasterService,
  ],
})
export class OrdersModule {}
