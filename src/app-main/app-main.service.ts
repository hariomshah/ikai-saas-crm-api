import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";
import { getEnabledCategories } from "trace_events";
@Injectable()
export class AppMainService {
  private logger = new Logger("AppMainService");

  constructor(private readonly conn: Connection) { }

  async getUserMenu(pCompCode, pUserId): Promise<any> {
    console.log(pUserId, pCompCode, "getUserMenu");
    try {
      let query = `CALL spGetUserMenu (?,?)`;
      const data = await this.conn.query(query, [
        pCompCode,
        pUserId === "null" ? null : pUserId,
      ]).catch(err=>console.log(err));
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  async getDataHomeScreenAppLayout(CompCode): Promise<any> {
    try {
      let query = `CALL spGetDataHomeScreenAppLayout (?)`;
      const data = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  async getConfigs(CompCode): Promise<any> {
    try {
      let query = `CALL spGetConfig (?)`;
      const data = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getUserInfo(CompCode: any, userType: any, userId: any): Promise<any> {
    try {
      let query = `CALL spGetUserInfo (?,?,?)`;
      // return await this.conn.query(query);
      const data = await this.conn.query(query, [CompCode, userType, userId]);
      // console.log( data[0])
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async updateUserInfo(
    CompCode: any,
    userType: any,
    userId: any,
    userTypeRef: any,
    Name: any,
    email: any,
    mobile: any,
    gender: any,
    loginUserId: any
  ): Promise<any> {
    try {
      let query = `CALL spUpdateUserInfo (?,?,?,?,?,?,?,?,?)`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query, [
        CompCode,
        userType,
        userId,
        userTypeRef,
        Name,
        email,
        mobile,
        gender,
        loginUserId,
      ]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getPromos(CompCode): Promise<any> {
    try {
      let query = `CALL spGetPromos (?)`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  async getServiceTypes(pCompCode, pShowInActiveAsWell): Promise<any> {
    try {
      // console.log(pShowInActiveAsWell);
      let query = `CALL spGetServiceTypes (?,?)`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query, [
        pCompCode,
        pShowInActiveAsWell === null ? false : pShowInActiveAsWell,
      ]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  async getServices(CompCode): Promise<any> {
    try {
      let query = `CALL spGetServices (?)`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getPackages(CompCode): Promise<any> {
    try {
      let query = `CALL spGetPackageMasters (?)`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  async getServicePackages(CompCode): Promise<any> {
    try {
      let query = `CALL spGetServicePackages (?)`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  async getLocations(CompCode): Promise<any> {
    try {
      let query = `CALL spGetLocations (?)`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getSlots(CompCode): Promise<any> {
    try {
      let query = `CALL spGetDataSlots (?)`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  async getServiceSlotLocMapp(CompCode): Promise<any> {
    try {
      let query = `CALL spGetDataServiceSlotLocMapp (?)`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getUserPatientProfiles(CompCode: any, userType: any, userId: any): Promise<any> {
    try {
      let query = `CALL spGetUserPatientProfiles(?,?,?)`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query, [CompCode, userType, userId]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
  async getUserPatientAddresses(CompCode: any, userType: any, userId: any): Promise<any> {
    try {
      let query = `CALL spGetUserPatientAddresses (?,?,?)`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query, [CompCode, userType, userId]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  async crudUserPatientProfile(
    CompCode: any,
    OprationType: any,
    ProfileId: any,
    UserType: any,
    UserId: any,
    PatientName: any,
    Relationship: any,
    Gender: any,
    Age: any,
    Weight: any,
    MedicalCondition: any,
    knownLanguages: any,
    DietPreference: any,
    UpdtUsr: any
  ): Promise<any> {
    try {
      //let query = `CALL spCRUDUserPatientProfiles ('${OprationType}','${ProfileId}','${UserType}','${UserId}','${PatientName}','${Relationship}','${Gender}','${Age}','${Weight}','${MedicalCondition}','${knownLanguages}','${DietPreference}','${UpdtUsr}')`;
      //return await this.conn.query(query);
      let query = `CALL spCRUDUserPatientProfiles (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      const data = await this.conn.query(query, [
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
        UpdtUsr,
      ]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  async crudUserPatientAddress(
    CompCode: any,
    OprationType: any,
    AddressId: any,
    UserType: any,
    UserId: any,
    latitude: any,
    longitude: any,
    geoLocationName: any,
    add1: any,
    add2: any,
    add3: any,
    AddressTag: any,
    UpdtUsr: any
  ): Promise<any> {
    try {
      let query = `CALL spCRUDUserPatientAddress (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      const data = await this.conn.query(query, [
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
        UpdtUsr,
      ]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getNotificationTemplate(CompCode): Promise<any> {
    try {
      let query = `CALL spGetDataNotificationTemplate (?)`;
      const data = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getPushNotifications(CompCode: any, userType: any, userId: any): Promise<any> {
    try {
      let query = `CALL spGetDataPushNotifications (?,?,?)`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query, [CompCode, userType, userId]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  async getUserConfigs(CompCode: any, userType: any, userId: any): Promise<any> {
    try {
      let query = `CALL spGetDataUserConfigs (?,?,?)`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query, [CompCode, userType, userId]);
      console.log(data,"data")
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  async crudUserConfigs(
    CompCode: any,
    OprationType: any,
    UserType: any,
    UserId: any,
    IsReceivePushNotifications: any,
    IsReceivePromoEmails: any,
    IsReceivePromoSMS: any,
    ExpoNotificationToken: any,
    UpdtUsr: any
  ): Promise<any> {
    try {
      let query = `CALL spCRUDUserConfigs ('${CompCode}','${OprationType}','${UserType}','${UserId}','${IsReceivePushNotifications}','${IsReceivePromoEmails}','${IsReceivePromoSMS}','${ExpoNotificationToken}','${UpdtUsr}')`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  async insNotifications(
    CompCode: any,
    NotificationCode: any,
    NotificationType: any,
    UserType: any,
    UserId: any,
    Subject: any,
    Title: any,
    Message: any,
    NotificationDttm: any,
    DeliveryStatus: any,
    UpdtUserId: any
  ): Promise<any> {
    try {
      let query = `CALL spInsNotifications('${CompCode}','${NotificationCode}','${NotificationType}','${UserType}','${UserId}','${Subject}','${Title}','${Message}','${NotificationDttm}','${DeliveryStatus}','${UpdtUserId}')`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async updtNotifications(
    CompCode: any,
    Id: any,
    UserType: any,
    UserId: any,
    DeliveryStatus: any,
    UpdtUserId: any
  ): Promise<any> {
    try {
      let query = `CALL spUpdtNotifications('${CompCode}','${Id}','${UserType}','${UserId}','${DeliveryStatus}','${UpdtUserId}')`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  async InsUserLoginLogs(
    CompCode: any,
    UserType: any,
    UserId: any,
    MobileNo: any,
    DeviceName: any,
    ExpoDeviceId: any,
    SystemOS: any,
    SystemOSVerNo: any,
    ExpoNotificationToken: any
  ): Promise<any> {
    try {
      let query = `CALL spInsUser_login_logs('${CompCode}','${UserType}','${UserId}','${MobileNo}','${DeviceName}','${ExpoDeviceId}','${SystemOS}','${SystemOSVerNo}','${ExpoNotificationToken}')`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query);
 
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getSchCalendarData(CompCode, ScheduleDate): Promise<any> {
    try {
      let query = `CALL spGetScheduleCalenderDataMonthWise(?,?)`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query, [CompCode, ScheduleDate]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getReportDataKeys(CompCode): Promise<any> {
    try {
      let query = `CALL spGetReportDataKeys(?)`;
      //return await this.conn.query(query);

      const data = await this.conn.query(query, [CompCode]);
      // console.log(data[0], "sp called");
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }


}
