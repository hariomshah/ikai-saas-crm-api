import {
  Injectable,
  InternalServerErrorException,
  Logger,
  HttpService,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class NotificationCenterService {
  private logger = new Logger("NotificationCenterService");

  constructor(
    private readonly conn: Connection,
    private readonly http: HttpService
  ) {}

  async getNotificationTranEvents(CompCode): Promise<any> {
    try {
      let query = `CALL spGetNotificationTranEvents (?)`;
      // console.log(UserId = "undefined" ? 0 : UserId);
      const res = await this.conn.query(query,[CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getNotificationPromoTemplate(CompCode): Promise<any> {
    try {
      let query = `CALL spGetNotificationPromoTemplate (?)`;
      // console.log(UserId = "undefined" ? 0 : UserId);
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getNotificationTranDtl(CompCode,TranId): Promise<any> {
    try {
      let query = `CALL spGetNotificationTranDtl (?,?)`;
      // console.log(UserId = "undefined" ? 0 : UserId);
      const res = await this.conn.query(query, [CompCode,TranId]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getNotificationTranEventMapp(CompCode,EventCode): Promise<any> {
    try {
      let query = `CALL spGetNotificationTranEventMapp (?,?)`;
      // console.log(UserId = "undefined" ? 0 : UserId);
      const res = await this.conn.query(query, [CompCode,EventCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async InsUpdtNotificationTranDtl(
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
  ): Promise<any> {
    try {
      let query = `CALL spInsUpdtNotificationTranDtl(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      const res = await this.conn.query(query, [
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
        UpdtUsr,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getNotificationLogs(
    CompCode,
    NotificationMode,
    NotificationType,
    FromDate,
    ToDate
  ): Promise<any> {
    try {
      let query = `CALL spGetNotificationLogs (?,?,?,?,?)`;
      // console.log(UserId = "undefined" ? 0 : UserId);
      const res = await this.conn.query(query, [
        CompCode,
        NotificationMode,
        NotificationType,
        FromDate,
        ToDate,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async InsUpdtNotificationPromoTemplate(data: any): Promise<any> {
    try {
      let query = `CALL spInsUpdtPromoTemplate(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      const res = await this.conn.query(query, [
        data.CompCode,
        data.TemplateId,
        data.TemplateName,
        data.NotificationType,
        data.DataValue1,
        data.DataValue2,
        data.DataValue3,
        data.DataValue4,
        data.DataValue5,
        data.DataValue6,
        data.DataValue7,
        data.ConfigValue1,
        data.ConfigValue2,
        data.ConfigValue3,
        data.ConfigValue4,
        data.ConfigValue5,
        data.ConfigValue6,
        data.ConfigValue7,
        data.IsEnabled,
        data.UpdtUsr,
      ]);
      // console.log(res);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getNotificationFetchFromSystem(CompCode): Promise<any> {
    try {
      let query = `CALL spGetNotificationFetchFromSystem (?)`;
      // console.log(UserId = "undefined" ? 0 : UserId);
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getNotificationCallSystemSp(CompCode,pSystemSp): Promise<any> {
    try {
      let query = `CALL '${CompCode}','${pSystemSp}'`;
      // console.log(UserId = "undefined" ? 0 : UserId);
      const res = await this.conn.query(query, []);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
}
