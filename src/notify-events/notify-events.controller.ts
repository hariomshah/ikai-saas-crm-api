import { Controller, Logger, Body, Post } from "@nestjs/common";
import { NotifyEventsService } from "./notify-events.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@Controller("notify-events")
export class NotifyEventsController {
  private logger = new Logger("NotifyEventsController");
  constructor(private notifyEvents: NotifyEventsService) { }

  // @UseGuards(AuthGuard())
  @Post("raiseEvent")
  getOrdersPortal(
    @Body("CompCode") CompCode: any,
    @Body("EventCode") EventCode: any,
    @Body("data") data: any
  ): Promise<any> {
    // console.log(EventCode, data);
    return this.notifyEvents.processEvents(CompCode, EventCode, data);
  }

  // @UseGuards(AuthGuard())
  @Post("savePromoNotificationTran")
  savePromoNotificationTran(@Body("data") data: any, @Body("CompCode") CompCode: any,): Promise<any> {
    return this.notifyEvents.savePromoNotificationTran(data, CompCode);
  }
}
