import { Module, HttpModule } from "@nestjs/common";
import { PaymentGatewayService } from "./payment-gateway.service";
import { PaymentGatewayController } from "./payment-gateway.controller";
import { NotifyEmailService } from "../notify-email/notify-email.service";
import { NotifySmsService } from "../notify-sms/notify-sms.service";
import { NotifyPushNotificationService } from "../notify-push-notification/notify-push-notification.service";
import { NotifyEventsService } from "../notify-events/notify-events.service";
import { NotifyEventsModule } from "../notify-events/notify-events.module";

import { RecieptService } from "../reciept/reciept.service";
import { RecieptModule } from "../reciept/reciept.module";
import { SysSequenceConfigmasterService } from "src/sys-sequence-configmaster/sys-sequence-configmaster.service";

@Module({
  imports: [HttpModule, NotifyEventsModule, RecieptModule],
  providers: [
    PaymentGatewayService,
    NotifyEmailService,
    NotifySmsService,
    NotifyPushNotificationService,
    NotifyEventsService,
    RecieptService,
    SysSequenceConfigmasterService,
  ],
  controllers: [PaymentGatewayController],
})
export class PaymentGatewayModule {}
