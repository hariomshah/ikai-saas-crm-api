import { Controller, Logger, Post, Body, Get, Param } from "@nestjs/common";
import { NotificationCenterService } from "./notification-center.service";

@Controller("notification-center")
export class NotificationCenterController {
  private logger = new Logger("NotificationCenterController");

  constructor(private notification: NotificationCenterService) {}
  @Get("getNotificationTranEvents/:CompCode")
  getNotificationTranEvents(@Param("CompCode") CompCode: any): Promise<any> {
    return this.notification.getNotificationTranEvents(CompCode);
  }

  @Get("getNotificationPromoTemplate/:CompCode")
  getNotificationPromoTemplate(@Param("CompCode") CompCode: any): Promise<any> {
    return this.notification.getNotificationPromoTemplate(CompCode);
  }

  
  @Get("getNotificationTranDtl/:CompCode/:TranId")
  getNotificationTranDtl(
    @Param("CompCode") CompCode: any,
    @Param("TranId") TranId: any): Promise<any> {
    return this.notification.getNotificationTranDtl(CompCode,TranId);
  }

  @Get("getNotificationTranEventMapp/:CompCode/:EventCode")
  getNotificationTranEventMapp(
    @Param("CompCode") CompCode: any,
    @Param("EventCode") EventCode: any
  ): Promise<any> {
    return this.notification.getNotificationTranEventMapp(CompCode,EventCode);
  }

  @Post("InsUpdtNotificationTranDtl")
  InsUpdtNotificationTranDtl(
    @Body("CompCode") CompCode: any,
    @Body("PkId") PkId: any,
    @Body("NotificationTranId") NotificationTranId: any,
    @Body("InsUpdtType") InsUpdtType: any,
    @Body("NotificationType") NotificationType: any,
    @Body("DeliveryType") DeliveryType: any,
    @Body("WaitInSeconds") WaitInSeconds: any,
    @Body("title") title: any,
    @Body("IsEnabled") IsEnabled: any,
    @Body("DataValue1") DataValue1: any,
    @Body("DataValue2") DataValue2: any,
    @Body("DataValue3") DataValue3: any,
    @Body("DataValue4") DataValue4: any,
    @Body("DataValue5") DataValue5: any,
    @Body("DataValue6") DataValue6: any,
    @Body("DataValue7") DataValue7: any,
    @Body("ConfigValue1") ConfigValue1: any,
    @Body("ConfigValue2") ConfigValue2: any,
    @Body("ConfigValue3") ConfigValue3: any,
    @Body("ConfigValue4") ConfigValue4: any,
    @Body("ConfigValue5") ConfigValue5: any,
    @Body("ConfigValue6") ConfigValue6: any,
    @Body("ConfigValue7") ConfigValue7: any,
    @Body("UpdtUsr") UpdtUsr: any
  ): Promise<any> {
    return this.notification.InsUpdtNotificationTranDtl(
      CompCode,
      PkId,
      NotificationTranId,
      InsUpdtType,
      NotificationType,
      DeliveryType,
      WaitInSeconds,
      title,
      IsEnabled,
      DataValue1,
      DataValue2,
      DataValue3,
      DataValue4,
      DataValue5,
      DataValue6,
      DataValue7,
      ConfigValue1,
      ConfigValue2,
      ConfigValue3,
      ConfigValue4,
      ConfigValue5,
      ConfigValue6,
      ConfigValue7,
      UpdtUsr
    );
  }

  @Get(
    "getNotificationLogs/:CompCode/:NotificationMode/:NotificationType/:FromDate/:ToDate"
  )
  getNotificationLogs(
    @Param("CompCode") CompCode: any,
    @Param("NotificationMode") NotificationMode: any,
    @Param("NotificationType") NotificationType: any,
    @Param("FromDate") FromDate: any,
    @Param("ToDate") ToDate: any
  ): Promise<any> {
    // console.log(UserId)
    return this.notification.getNotificationLogs(
      CompCode,
      NotificationMode,
      NotificationType,
      FromDate,
      ToDate
    );
  }

  @Post("InsUpdtNotificationPromoTemplate")
  InsUpdtSubCategoryMaster(@Body("data") data: any): Promise<any> {
    return this.notification.InsUpdtNotificationPromoTemplate(data);
  }

  @Get("getNotificationFetchFromSystem/:CompCode")
  getNotificationFetchFromSystem(@Param("CompCode") CompCode: any): Promise<any> {
    return this.notification.getNotificationFetchFromSystem(CompCode);
  }

  @Get("getNotificationCallSystemSp/:CompCode/:pSystemSp")
  getNotificationCallSystemSp(
    @Param("CompCode") CompCode: any,
    @Param("pSystemSp") pSystemSp: any
  ): Promise<any> {
    return this.notification.getNotificationCallSystemSp(CompCode,pSystemSp);
  }
}
