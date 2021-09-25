import { Controller, Logger, Get, Body, Post, Param } from "@nestjs/common";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";
import { FeedbackService } from "./feedback.service";

@UseGuards(AuthGuard())
@Controller("feedback")
export class FeedbackController {
  private logger = new Logger("FeedbackController");

  constructor(private feedBack: FeedbackService) {}

  @Get("getFeedBackData/:CompCode/:OrderId/:ScheduleId")
  getFeedBackData(
    @Param("CompCode") CompCode: any,
    @Param("OrderId") OrderId: any,
    @Param("ScheduleId") ScheduleId: any
  ): Promise<any> {
    return this.feedBack.getFeedBackData(CompCode,OrderId, ScheduleId);
  }
}
