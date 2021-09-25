import {
  Controller,
  Logger,
  Get,
  Body,
  Post,
  UseGuards,
  Param,
} from "@nestjs/common";
import { AppMainService } from "./app-main.service";
import AuthGuard from "src/auth/auth.guard";

@UseGuards(AuthGuard())
@Controller("appmain")
export class AppMainController {
  private logger = new Logger("AppMainController");

  constructor(private service: AppMainService) { }

  @Get("getConfigs/:CompCode")
  getConfigs(@Param("CompCode") CompCode: any): Promise<any> {
    return this.service.getConfigs(CompCode);
  }

  @Get("getDataHomeScreenAppLayout/:CompCode")
  getDataHomeScreenAppLayout(@Param("CompCode") CompCode: any): Promise<any> {
    return this.service.getDataHomeScreenAppLayout(CompCode);
  }

  @Post("getUserInfo")
  getUserInfo(
    @Body("CompCode") CompCode: any,
    @Body("userType") userType: any,
    @Body("userId") userId: any
  ): Promise<any> {
    return this.service.getUserInfo(CompCode, userType, userId);
  }

  @Post("updateUserInfo")
  updateUserInfo(
    @Body("CompCode") CompCode: any,
    @Body("userType") userType: any,
    @Body("userId") userId: any,
    @Body("userTypeRef") userTypeRef: any,
    @Body("Name") userName: any,
    @Body("email") email: any,
    @Body("mobile") mobile: any,
    @Body("gender") gender: any,
    @Body("loginUserId") loginUserId: any
  ): Promise<any> {
    return this.service.updateUserInfo(
      CompCode,
      userType,
      userId,
      userTypeRef,
      userName,
      email,
      mobile,
      gender,
      loginUserId
    );
  }

  @Get("getPromos/:CompCode")
  getPromos(@Param("CompCode") CompCode: any): Promise<any> {
    return this.service.getPromos(CompCode);
  }

  @Get("getPackages/:CompCode")
  getPackages(@Param("CompCode") CompCode: any): Promise<any> {
    return this.service.getPackages(CompCode);
  }

  @Post("getServiceTypes")
  getServiceTypes(
    @Body("CompCode") CompCode: any,
    @Body("showInActiveAsWell") showInActiveAsWell: any
  ): Promise<any> {
    return this.service.getServiceTypes(CompCode, showInActiveAsWell);
  }

  @Get("getServices/:CompCode")
  getServices(@Param("CompCode") CompCode: any): Promise<any> {
    return this.service.getServices(CompCode);
  }
  @Get("getServicePackages/:CompCode")
  getServicePackages(@Param("CompCode") CompCode: any): Promise<any> {
    return this.service.getServicePackages(CompCode);
  }
  @Get("getLocations/:CompCode")
  getLocations(@Param("CompCode") CompCode: any): Promise<any> {
    return this.service.getLocations(CompCode);
  }
  @Get("getSlots/:CompCode")
  getSlots(@Param("CompCode") CompCode: any): Promise<any> {
    return this.service.getSlots(CompCode);
  }
  @Get("getServiceSlotLocMapp/:CompCode")
  getServiceSlotLocMapp(@Param("CompCode") CompCode: any): Promise<any> {
    return this.service.getServiceSlotLocMapp(CompCode);
  }
  @Post("getUserPatientProfiles")
  getUserPatientProfiles(
    @Body("CompCode") CompCode: any,
    @Body("userType") userType: any,
    @Body("userId") userId: any
  ): Promise<any> {
    return this.service.getUserPatientProfiles(CompCode, userType, userId);
  }

  @Post("getUserPatientAddresses")
  getUserPatientAddresses(
    @Body("CompCode") CompCode: any,
    @Body("userType") userType: any,
    @Body("userId") userId: any
  ): Promise<any> {
    return this.service.getUserPatientAddresses(CompCode, userType, userId);
  }

  @Post("crudUserPatientProfile")
  crudUserPatientProfile(
    @Body("CompCode") CompCode: any,
    @Body("OprationType") OprationType: any,
    @Body("ProfileId") ProfileId: any,
    @Body("UserType") UserType: any,
    @Body("UserId") UserId: any,
    @Body("PatientName") PatientName: any,
    @Body("Relationship") Relationship: any,
    @Body("Gender") Gender: any,
    @Body("Age") Age: any,
    @Body("Weight") Weight: any,
    @Body("MedicalCondition") MedicalCondition: any,
    @Body("knownLanguages") knownLanguages: any,
    @Body("DietPreference") DietPreference: any,
    @Body("UpdtUsr") UpdtUsr: any
  ): Promise<any> {
    return this.service.crudUserPatientProfile(
      CompCode,
      OprationType,
      ProfileId,
      UserType,
      UserId,
      PatientName,
      Relationship,
      Gender,
      Age,
      Weight,
      MedicalCondition,
      knownLanguages,
      DietPreference,
      UpdtUsr
    );
  }
  @Post("crudUserPatientAddress")
  crudUserPatientAddress(
    @Body("CompCode") CompCode: any,
    @Body("OprationType") OprationType: any,
    @Body("AddressId") AddressId: any,
    @Body("UserType") UserType: any,
    @Body("UserId") UserId: any,
    @Body("latitude") latitude: any,
    @Body("longitude") longitude: any,
    @Body("geoLocationName") geoLocationName: any,
    @Body("add1") add1: any,
    @Body("add2") add2: any,
    @Body("add3") add3: any,
    @Body("AddressTag") AddressTag: any,
    @Body("UpdtUsr") UpdtUsr: any
  ): Promise<any> {
    // console.log('addressId', AddressId)
    return this.service.crudUserPatientAddress(
      CompCode,
      OprationType,
      AddressId,
      UserType,
      UserId,
      latitude,
      longitude,
      geoLocationName,
      add1,
      add2,
      add3,
      AddressTag,
      UpdtUsr
    );
  }

  @Get("getNotificationTemplate/:CompCode")
  getNotificationTemplate(@Param("CompCode") CompCode: any): Promise<any> {
    return this.service.getNotificationTemplate(CompCode);
  }

  @Post("getPushNotifications")
  getPushNotifications(
    @Body("CompCode") CompCode: any,
    @Body("userType") userType: any,
    @Body("userId") userId: any
  ): Promise<any> {
    return this.service.getPushNotifications(CompCode, userType, userId);
  }
  @Post("getUserConfigs")
  getUserConfigs(
    @Body("CompCode") CompCode: any,
    @Body("userType") userType: any,
    @Body("userId") userId: any
  ): Promise<any> {
    return this.service.getUserConfigs(CompCode, userType, userId);
  }
  @Post("crudUserConfigs")
  crudUserConfigs(
    @Body("CompCode") CompCode: any,
    @Body("OprationType") OprationType: any,
    @Body("UserType") UserType: any,
    @Body("UserId") UserId: any,
    @Body("IsReceivePushNotifications") IsReceivePushNotifications: any,
    @Body("IsReceivePromoEmails") IsReceivePromoEmails: any,
    @Body("IsReceivePromoSMS") IsReceivePromoSMS: any,
    @Body("ExpoNotificationToken") ExpoNotificationToken: any,
    @Body("UpdtUsr") UpdtUsr: any
  ): Promise<any> {
    return this.service.crudUserConfigs(
      CompCode,
      OprationType,
      UserType,
      UserId,
      IsReceivePushNotifications,
      IsReceivePromoEmails,
      IsReceivePromoSMS,
      ExpoNotificationToken,
      UpdtUsr
    );
  }
  @Post("insNotifications")
  insNotifications(
    @Body("CompCode") CompCode: any,
    @Body("NotificationCode") NotificationCode: any,
    @Body("NotificationType") NotificationType: any,
    @Body("UserType") UserType: any,
    @Body("UserId") UserId: any,
    @Body("Subject") Subject: any,
    @Body("Title") Title: any,
    @Body("Message") Message: any,
    @Body("NotificationDttm") NotificationDttm: any,
    @Body("DeliveryStatus") DeliveryStatus: any,
    @Body("UpdtUserId") UpdtUserId: any
  ): Promise<any> {
    return this.service.insNotifications(
      CompCode,
      NotificationCode,
      NotificationType,
      UserType,
      UserId,
      Subject,
      Title,
      Message,
      NotificationDttm,
      DeliveryStatus,
      UpdtUserId
    );
  }
  @Post("updtNotifications")
  updtNotifications(
    @Body("CompCode") CompCode: any,
    @Body("Id") Id: any,
    @Body("UserType") UserType: any,
    @Body("UserId") UserId: any,
    @Body("DeliveryStatus") DeliveryStatus: any,
    @Body("UpdtUserId") UpdtUserId: any
  ): Promise<any> {
    return this.service.updtNotifications(
      CompCode,
      Id,
      UserType,
      UserId,
      DeliveryStatus,
      UpdtUserId
    );
  }

  @Get("getUserMenu/:CompCode/:UserId")
  getUserMenu(
    @Param("CompCode") CompCode: any,
    @Param("UserId") UserId: any
  ): Promise<any> {
    // console.log('getUserMenu');
    return this.service.getUserMenu(CompCode, UserId);
  }

  @Post("InsUserLoginLogs")
  InsUserLoginLogs(
    @Body("CompCode") CompCode: any,
    @Body("UserType") UserType: any,
    @Body("UserId") UserId: any,
    @Body("MobileNo") MobileNo: any,
    @Body("DeviceName") DeviceName: any,
    @Body("ExpoDeviceId") ExpoDeviceId: any,
    @Body("SystemOS") SystemOS: any,
    @Body("SystemOSVerNo") SystemOSVerNo: any,
    @Body("ExpoNotificationToken") ExpoNotificationToken: any
  ): Promise<any> {
    return this.service.InsUserLoginLogs(
      CompCode,
      UserType,
      UserId,
      MobileNo,
      DeviceName,
      ExpoDeviceId,
      SystemOS,
      SystemOSVerNo,
      ExpoNotificationToken
    );
  }
  // @UseGuards(AuthGuard())
  @Get("getSchCalendarData/:CompCode/:ScheduleDate")
  getSchCalendarData(
    @Param("CompCode") CompCode: any,
    @Param("ScheduleDate") ScheduleDate: any
  ): Promise<any> {
    return this.service.getSchCalendarData(CompCode, ScheduleDate);
  }

  @Get("getReportDataKeys/:CompCode")
  getReportDataKeys(@Param("CompCode") CompCode: any): Promise<any> {
    return this.service.getReportDataKeys(CompCode);
  }



}
