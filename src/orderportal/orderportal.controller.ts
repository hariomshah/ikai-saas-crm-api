import { Controller, Logger, Body, Post, Get, Param } from "@nestjs/common";
import { OrderportalService } from "./orderportal.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("orderportal")
export class OrderportalController {
  private logger = new Logger("OrderPortalController");

  constructor(private orderportal: OrderportalService) {}

  @Post("GetOrdersPortal")
  getOrdersPortal(
    @Body("CompCode") CompCode: any,
    @Body("FromDate") FromDate: any,
    @Body("ToDate") ToDate: any
  ): Promise<any> {
    return this.orderportal.getOrdersPortal(CompCode, FromDate, ToDate);
  }

  @Post("getOrderDetails")
  getOrderDetails(
    @Body("CompCode") CompCode: any,
    @Body("OrderId") OrderId: any
  ): Promise<any> {
    return this.orderportal.getOrderDetails(CompCode, OrderId);
  }

  @Post("ProcessOrderScheduleVisit")
  ProcessOrderScheduleVisit(
    @Body("CompCode") CompCode: any,
    @Body("OrderId") OrderId: any,
    @Body("UpdtUserId") UpdtUserId: any
  ): Promise<any> {
    return this.orderportal.ProcessOrderScheduleVisit(
      CompCode,
      OrderId,
      UpdtUserId
    );
  }

  @Post("UpdateOrderSchedule")
  UpdateOrderSchedule(
    @Body("CompCode") CompCode: any,
    @Body("InsUpdtType") InsUpdtType: any,
    @Body("ScheduleId") ScheduleId: any,
    @Body("OrderId") OrderId: any,
    @Body("ScheduleDate") ScheduleDate: any,
    @Body("SlotId") SlotId: any,
    @Body("AttendantId") AttendantId: any,
    @Body("Remark") Remark: any,
    @Body("Status") Status: any,
    @Body("UpdtUsr") UpdtUsr: any
  ): Promise<any> {
    return this.orderportal.UpdateOrderSchedule(
      CompCode,
      InsUpdtType,
      ScheduleId,
      OrderId,
      ScheduleDate,
      SlotId,
      AttendantId,
      Remark,
      Status,
      UpdtUsr
    );
  }

  @Post("getOrderScheduleVisit")
  getOrderScheduleVisit(
    @Body("CompCode") CompCode: any,
    @Body("OrderId") OrderId: any
  ): Promise<any> {
    return this.orderportal.getOrderScheduleVisit(CompCode,OrderId);
  }

  @Post("GetOrdersPortalHome")
  getOrdersPortalHome(
    @Body("CompCode") CompCode: any,
    @Body("FromDate") FromDate: any,
    @Body("ToDate") ToDate: any
  ): Promise<any> {
    return this.orderportal.getOrdersPortalHome(CompCode,FromDate,ToDate);
  }

  @Post("GetUpComingOrder")
  getUpComingOrder( @Body("CompCode") CompCode: any): Promise<any> {
    return this.orderportal.getUpComingOrder(CompCode);
  }

  @Get("getDataServiceOrders/:CompCode/:FromDate/:ToDate/:UserId")
  getDataServiceOrders(
    @Param("CompCode") CompCode: any,
    @Param("FromDate") FromDate: any,
    @Param("ToDate") ToDate: any,
    @Param("UserId") UserId: any
  ): Promise<any> {
    return this.orderportal.getDataServiceOrders(CompCode,FromDate, ToDate, UserId);
  }

  @Get("getDataServiceSchedules/:CompCode/:FromDate/:ToDate/:OrderId/:UserId")
  getDataServiceSchedules(
    @Param("CompCode") CompCode: any,
    @Param("FromDate") FromDate: any,
    @Param("ToDate") ToDate: any,
    @Param("OrderId") OrderId: any,
    @Param("UserId") UserId: any
  ): Promise<any> {
    return this.orderportal.getDataServiceSchedules(
      CompCode,
      FromDate,
      ToDate,
      OrderId,
      UserId
    );
  }

  //Atul on 20200619
  @Get("getDataServiceSchedulesVisit/:CompCode/:ScheduleId/:OrderId")
  getDataServiceSchedulesVisit(
    @Param("CompCode") CompCode: any,
    @Param("ScheduleId") ScheduleId: any,
    @Param("OrderId") OrderId: any
  ): Promise<any> {
    return this.orderportal.getDataServiceSchedulesVisit(CompCode,ScheduleId, OrderId);
  }

  // getDataServiceSchedulesAddonCost
  @Get("getDataServiceSchedulesAddonCost/:CompCode/:ScheduleId/:OrderId")
  getDataServiceSchedulesAddonCost(
    @Param("CompCode") CompCode: any,
    @Param("ScheduleId") ScheduleId: any,
    @Param("OrderId") OrderId: any
  ): Promise<any> {
    return this.orderportal.getDataServiceSchedulesAddonCost(
      CompCode,
      ScheduleId,
      OrderId
    );
  }

  @Post("InsUpdtOrderSchedule")
  InsUpdtOrderSchedule(
    @Body("CompCode") CompCode: any,
    @Body("ScheduleId") ScheduleId: any,
    @Body("OrderId") OrderId: any,
    @Body("ScheduleDate") ScheduleDate: any,
    @Body("SlotId") SlotId: any,
    @Body("AttendantId") AttendantId: any,
    @Body("Remark") Remark: any,
    @Body("Status") Status: any,
    @Body("UpdtUsr") UpdtUsr: any
  ): Promise<any> {
    return this.orderportal.InsUpdtOrderSchedule(
      CompCode,
      ScheduleId,
      OrderId,
      ScheduleDate,
      SlotId,
      AttendantId,
      Remark,
      Status,
      UpdtUsr
    );
  }

  @Post("InsUpdtOrderScheduleAddOnCost")
  InsUpdtOrderScheduleAddOnCost(@Body("data") data: any): Promise<any> {
    return this.orderportal.InsUpdtOrderScheduleAddOnCost(data);
  }

  @Get("getServiceOrder/:CompCode/:OrderId")
  getServiceOrder(
    @Param("CompCode") CompCode: any,
    @Param("OrderId") OrderId: any): Promise<any> {
    return this.orderportal.getServiceOrder(CompCode,OrderId);
  }

  @Post("InsOrderSchedule")
  InsOrderSchedule(@Body("data") data: any): Promise<any> {
    return this.orderportal.InsOrderSchedule(data);
  }

  @Post("cancelSchedule")
  cancelSchedule(@Body("data") data: any): Promise<any> {
    return this.orderportal.cancelSchedule(data);
  }

  @Get("GetPreInvoiceDataService/:CompCode/:OrderId/:ScheduleId")
  GetPreInvoiceDataService(
    @Param("CompCode") CompCode: any,
    @Param("OrderId") OrderId: any,
    @Param("ScheduleId") ScheduleId: any
  ): Promise<any> {
    return this.orderportal.GetPreInvoiceDataService(CompCode,OrderId, ScheduleId);
  }

  @Post("saveServiceInvoice")
  InsInvoice(@Body("data") data: any): Promise<any> {
    return this.orderportal.saveServiceInvoice(data);
  }

  @Post("serviceScheduleAcknowledge")
  serviceScheduleAcknowledge(@Body("data") data: any): Promise<any> {
    return this.orderportal.serviceScheduleAcknowledge(data);
  }
}
