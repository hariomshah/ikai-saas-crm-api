import { Controller, Logger, Post, Get, Body, Param } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

import * as config from "config";

const appConfig = config.get("appConfig");

@Controller("orders")
export class OrdersController {
  private logger = new Logger("OrdersController");

  constructor(private orders: OrdersService) {}
  @UseGuards(AuthGuard())
  @Post("insPaymentEntry")
  insPaymentEntry(
    @Body("CompCode") CompCode: any,
    @Body("OrderId") OrderId: any,
    @Body("PaymentDate") PaymentDate: any,
    @Body("API_OrderId") API_OrderId: any,
    @Body("API_PaymentId") API_PaymentId: any,
    @Body("Amount") Amount: any,
    @Body("userId") userId: any
  ): Promise<any> {
    return this.orders.insPaymentEntry(
      CompCode,
      OrderId,
      PaymentDate,
      API_OrderId,
      API_PaymentId,
      Amount,
      userId
    );
  }
  @UseGuards(AuthGuard())
  @Post("createRazonPaymentId")
  createRazonPaymentId(
    @Body("CompCode") CompCode: any,
    @Body("amount") amount: any,
    @Body("orderId") orderId: any
  ): Promise<any> {
    const res = this.orders.createRazonPaymentId(
      CompCode,
      amount,
      orderId,
      appConfig.RAZORPAY_UID,
      appConfig.RAZORPAY_PSWD,
      appConfig.RAZORPAY_API
    );

    return res;
  }
  @UseGuards(AuthGuard())
  @Post("updtPaymentEntry")
  updtPaymentEntry(
    @Body("CompCode") CompCode: any,
    @Body("OrderId") OrderId: any,
    @Body("API_OrderId") API_OrderId: any,
    @Body("API_PaymentId") API_PaymentId: any,
    @Body("userId") userId: any,
    @Body("SendOrderSMS") SendOrderSMS: any
  ): Promise<any> {
    return this.orders.updtPaymentEntry(
      CompCode,
      OrderId,
      API_OrderId,
      API_PaymentId,
      userId,
      SendOrderSMS
    );
  }
  @UseGuards(AuthGuard())
  @Post("orderReSchedule")
  orderReSchedule(
    @Body("CompCode") CompCode: any,
    @Body("OrderId") OrderId: any,
    @Body("ScheduleFromDate") ScheduleFromDate: any,
    @Body("ScheduleToDate") ScheduleToDate: any,
    @Body("SlotId") SlotId: any,
    @Body("UpdtUsrId") UpdtUsrId: any
  ): Promise<any> {
    return this.orders.orderReSchedule(
      CompCode,
      OrderId,
      ScheduleFromDate,
      ScheduleToDate,
      SlotId,
      UpdtUsrId
    );
  }
  @UseGuards(AuthGuard())
  @Post("cancelOrder")
  cancelOrder(
    @Body("CompCode") CompCode: any,
    @Body("orderId") orderId: any,
    @Body("UpdtUserId") UpdtUserId: any
  ): Promise<any> {
    return this.orders.cancelOrder(CompCode, orderId, UpdtUserId);
  }
  @UseGuards(AuthGuard())
  @Post("markOrderDelete")
  markOrderDelete(
    @Body("CompCode") CompCode: any,
    @Body("orderId") orderId: any,
    @Body("UpdtUserId") UpdtUserId: any
  ): Promise<any> {
    return this.orders.markOrderDelete(CompCode, orderId, UpdtUserId);
  }
  @UseGuards(AuthGuard())
  @Post("getOrderDetails")
  getOrderDetails(
    @Body("CompCode") CompCode: any,
    @Body("orderId") orderId: any
  ): Promise<any> {
    return this.orders.getOrderDetails(CompCode, orderId);
  }
  @UseGuards(AuthGuard())
  @Post("createOrder")
  createOrder(
    @Body("CompCode") CompCode: any,
    @Body("order") order: any,
    @Body("orderDtl") orderDtl: any,
    @Body("SendOrderCompleteNotification") SendOrderCompleteNotification: any
  ): Promise<any> {
    return this.orders.createOrder(
      CompCode,
      order,
      orderDtl,
      SendOrderCompleteNotification
    );
  }
  @UseGuards(AuthGuard())
  @Post("getOrders")
  getOrders(
    @Body("userType") userType: any,
    @Body("userId") userId: any
  ): Promise<any> {
    return this.orders.getOrders(userType, userId);
  }
  @UseGuards(AuthGuard())
  @Post("BookingAccept")
  bookingAccept(
    @Body("CompCode") CompCode: any,
    @Body("orderId") orderId: any,
    @Body("UpdtUserId") UpdtUserId: any
  ): Promise<any> {
    return this.orders.bookingAccept(CompCode, orderId, UpdtUserId);
  }
  @UseGuards(AuthGuard())
  @Post("SendScheduleSMS")
  SendScheduleSMS(
    @Body("CompCode") CompCode: any,
    @Body("ScheduleId") ScheduleId: any,
    @Body("UpdtUsr") UpdtUsr: any
  ): Promise<any> {
    return this.orders.sendScheduleSMS(CompCode, ScheduleId, UpdtUsr);
  }
  @UseGuards(AuthGuard())
  @Post("BookingPaymentCancel")
  BookingPaymentCancel(
    @Body("CompCode") CompCode: any,
    @Body("orderId") orderId: any,
    @Body("UpdtUserId") UpdtUserId: any
  ): Promise<any> {
    return this.orders.bookingPaymentCancel(CompCode, orderId, UpdtUserId);
  }
  @UseGuards(AuthGuard())
  @Post("BookingReject")
  bookingReject(
    @Body("CompCode") CompCode: any,
    @Body("orderId") orderId: any,
    @Body("UpdtUserId") UpdtUserId: any
  ): Promise<any> {
    return this.orders.bookingReject(CompCode, orderId, UpdtUserId);
  }
  @UseGuards(AuthGuard())
  @Post("assignAttendant")
  assignAttendant(
    @Body("CompCode") CompCode: any,
    @Body("orderId") orderId: any,
    @Body("attendantId") attendantId: any,
    @Body("UpdtUserId") UpdtUserId: any
  ): Promise<any> {
    return this.orders.assignAttendant(
      CompCode,
      orderId,
      attendantId,
      UpdtUserId
    );
  }
  @UseGuards(AuthGuard())
  @Post("getUpcompingSchedulesAttendant")
  getUpcompingSchedulesAttendant(
    @Body("CompCode") CompCode: any,
    @Body("AttendantId") AttendantId: any
  ): Promise<any> {
    return this.orders.getUpcompingSchedulesAttendant(CompCode, AttendantId);
  }
  @UseGuards(AuthGuard())
  @Post("getAttendantDataDateWise")
  getAttendantDataDateWise(
    @Body("CompCode") CompCode: any,
    @Body("AttendantId") AttendantId: any,
    @Body("Date") Date: any
  ): Promise<any> {
    return this.orders.getAttendantDataDateWise(CompCode, AttendantId, Date);
  }
  @UseGuards(AuthGuard())
  @Post("getAttendantScheduleDates")
  getAttendantScheduleDates(
    @Body("CompCode") CompCode: any,
    @Body("AttendantId") AttendantId: any
  ): Promise<any> {
    return this.orders.getAttendantScheduleDates(CompCode, AttendantId);
  }
  @UseGuards(AuthGuard())
  @Post("getAttendantScheduleData")
  getAttendantScheduleData(
    @Body("CompCode") CompCode: any,
    @Body("ScheduleId") ScheduleId: any
  ): Promise<any> {
    return this.orders.getAttendantScheduleData(CompCode, ScheduleId);
  }
  @UseGuards(AuthGuard())
  @Post("InsUpdtScheduleCheckIn")
  InsUpdtScheduleCheckIn(
    @Body("CompCode") CompCode: any,
    @Body("ScheduleId") ScheduleId: any,
    @Body("OrderId") OrderId: any,
    @Body("CheckInDTTM") CheckInDTTM: any,
    @Body("latitude") latitude: any,
    @Body("longitude") longitude: any,
    // @Body("CheckInImage") CheckInImage: any,
    @Body("UpdtUsr") UpdtUsr: any
  ): Promise<any> {
    // console.log('on endpoint checkin schedule',CheckInImage.length)
    return this.orders.InsUpdtScheduleCheckIn(
      CompCode,
      ScheduleId,
      OrderId,
      CheckInDTTM,
      latitude,
      longitude,
      // CheckInImage,
      UpdtUsr
    );
  }
  @UseGuards(AuthGuard())
  @Post("InsUpdtScheduleCheckOut")
  InsUpdtScheduleCheckOut(
    @Body("CompCode") CompCode: any,
    @Body("ScheduleId") ScheduleId: any,
    @Body("OrderId") OrderId: any,
    @Body("CheckOutDTTM") CheckOutDTTM: any,
    @Body("Observation") Observation: any,
    @Body("Resolution") Resolution: any,
    @Body("CheckOutRemark") CheckOutRemark: any,
    @Body("UpdtUsr") UpdtUsr: any
  ): Promise<any> {
    return this.orders.InsUpdtScheduleCheckOut(
      CompCode,
      ScheduleId,
      OrderId,
      CheckOutDTTM,
      Observation,
      Resolution,
      CheckOutRemark,
      UpdtUsr
    );
  }
  @UseGuards(AuthGuard())
  @Post("InsUpdtOrderScheduleAddOnCost")
  InsUpdtOrderScheduleAddOnCost(
    @Body("CompCode") CompCode: any,
    @Body("ScheduleId") ScheduleId: any,
    @Body("OrderId") OrderId: any,
    @Body("SrNo") SrNo: any,
    @Body("ItemDesc") ItemDesc: any,
    @Body("Rate") Rate: any,
    @Body("UpdtUsr") UpdtUsr: any
  ): Promise<any> {
    return this.orders.InsUpdtOrderScheduleAddOnCost(
      CompCode,
      ScheduleId,
      OrderId,
      SrNo,
      ItemDesc,
      Rate,
      UpdtUsr
    );
  }
  @UseGuards(AuthGuard())
  @Post("getDataScheduleAddOnCost")
  getDataScheduleAddOnCost(
    @Body("CompCode") CompCode: any,
    @Body("ScheduleId") ScheduleId: any
  ): Promise<any> {
    return this.orders.getDataScheduleAddOnCost(CompCode, ScheduleId);
  }
  @UseGuards(AuthGuard())
  @Post("getDataScheduleCheckIn")
  getDataScheduleCheckIn(
    @Body("CompCode") CompCode: any,
    @Body("ScheduleId") ScheduleId: any
  ): Promise<any> {
    return this.orders.getDataScheduleCheckIn(CompCode, ScheduleId);
  }
  @UseGuards(AuthGuard())
  @Post("getDataScheduleCheckOut")
  getDataScheduleCheckOut(
    @Body("CompCode") CompCode: any,
    @Body("ScheduleId") ScheduleId: any
  ): Promise<any> {
    return this.orders.getDataScheduleCheckOut(CompCode, ScheduleId);
  }
  @UseGuards(AuthGuard())
  @Post("AttendantProcess")
  attendantProcess(
    @Body("CompCode") CompCode: any,
    @Body("statusCode") statusCode: any,
    @Body("orderId") orderId: any,
    @Body("UpdtUserId") UpdtUserId: any,
    @Body("OrderRemark") OrderRemark: any
  ): Promise<any> {
    return this.orders.attendantProcess(
      CompCode,
      statusCode,
      orderId,
      UpdtUserId,
      OrderRemark
    );
  }
  @UseGuards(AuthGuard())
  @Post("DeleteScheduleAddonCost")
  DeleteScheduleAddOnCost(
    @Body("CompCode") CompCode: any,
    @Body("ScheduleId") ScheduleId: any,
    @Body("OrderId") OrderId: any,
    @Body("SrNo") SrNo: any
  ): Promise<any> {
    return this.orders.DeleteScheduleAddOnCost(
      CompCode,
      ScheduleId,
      OrderId,
      SrNo
    );
  }
  @UseGuards(AuthGuard())
  @Get("getOrderCurrentSchedule/:orderId")
  getOrderCurrentSchedule(
    @Body("CompCode") CompCode: any,
    @Param("orderId") orderId: any
  ): Promise<any> {
    return this.orders.getOrderCurrentSchedule(CompCode, orderId);
  }
  @UseGuards(AuthGuard())
  @Get("getOrderSchedule/:orderId")
  getOrderSchedule(
    @Body("CompCode") CompCode: any,
    @Param("orderId") orderId: any
  ): Promise<any> {
    return this.orders.getOrderSchedule(CompCode, orderId);
  }
  @UseGuards(AuthGuard())
  @Get("getAdditionalCost/:scheduleId")
  getAdditionalCost(
    @Body("CompCode") CompCode: any,
    @Param("scheduleId") scheduleId: any
  ): Promise<any> {
    return this.orders.getAdditionalCost(CompCode, scheduleId);
  }
  @UseGuards(AuthGuard())
  @Post("setMarkCheckIn")
  setMarkCheckIn(
    @Body("CompCode") CompCode: any,
    @Body("scheduleId") scheduleId: any,
    @Body("markCheckIn") markCheckIn: any,
    @Body("updtUsrId") updtUsrId: any
  ): Promise<any> {
    return this.orders.setMarkCheckIn(
      CompCode,
      scheduleId,
      markCheckIn,
      updtUsrId
    );
  }
  @UseGuards(AuthGuard())
  @Post("setMarkCheckOut")
  setMarkCheckOut(
    @Body("CompCode") CompCode: any,
    @Body("scheduleId") scheduleId: any,
    @Body("markCheckOut") markCheckOut: any,
    @Body("updtUsrId") updtUsrId: any
  ): Promise<any> {
    return this.orders.setMarkCheckOut(CompCode,scheduleId, markCheckOut, updtUsrId);
  }

  @Post("createRazonPaymentId-Open")
  createRazonPaymentIdOpen(
    @Body("CompCode") CompCode: any,
    @Body("amount") amount: any,
    @Body("orderId") orderId: any
  ): Promise<any> {
    const res = this.orders.createRazonPaymentId(
      CompCode,
      amount,
      orderId,
      appConfig.RAZORPAY_UID,
      appConfig.RAZORPAY_PSWD,
      appConfig.RAZORPAY_API
    );

    return res;
  }
}
