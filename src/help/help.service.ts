import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";
import { NotifyEventsService } from "../notify-events/notify-events.service";
@Injectable()
export class HelpService {
  private logger = new Logger("HelpService");

  constructor(
    private readonly conn: Connection,
    private notifyEvents: NotifyEventsService
  ) {}
  async insHelpTran(data: any): Promise<any> {
    const {
      CompCode,
      UserType,
      HelpType,
      UserId,
      HelpId,
      MobileNo,
      OrderNo,
      CustomHelpText,
      statusCode,
      updtUsrId,
    } = data;

    try {
      let query = `CALL spInshelpcenter_tran (?,?,?,?,?,?,?,?,?,?)`;

      const data = await this.conn.query(query, [
        CompCode,
        UserType,
        HelpType,
        UserId,
        HelpId,
        MobileNo,
        OrderNo,
        CustomHelpText,
        statusCode,
        updtUsrId,
      ]);

      const dt = {
        TicketNo: data[0][0].TicketNo,
      };
      this.notifyEvents.processEvents(CompCode, "SUPPORT", dt);

      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
  async getHelpCenterData(CompCode: any, userType: any): Promise<any> {
    try {
      let query = `CALL spGetDataHelpCenter ('${CompCode}','${userType}')`;

      //return await this.conn.query(query);
      const data = await this.conn.query(query);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getFAQData(CompCode, userType): Promise<any> {
    try {
      let query = `CALL spGetDataFAQ ('${CompCode}','${userType}')`;

      //return await this.conn.query(query);
      const data = await this.conn.query(query);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getPendingSupportTickets(CompCode): Promise<any> {
    try {
      let query = `CALL spGetPendingSupportTickets (?)`;
      const data = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getSupportTickets(CompCode, fromDate, toDate): Promise<any> {
    try {
      let query = `CALL spGetSupportTickets (?,?,?)`;
      const data = await this.conn.query(query, [CompCode, fromDate, toDate]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async updtSupportTicket(
    CompCode,
    StatusCode,
    Remark,
    TicketNo,
    UpdtUsrId
  ): Promise<any> {
    try {
      let query = `CALL spUpdtSupportTicket (?,?,?,?,?)`;
      const data = await this.conn.query(query, [
        CompCode,
        StatusCode,
        Remark,
        TicketNo,
        UpdtUsrId,
      ]);
      // console.log(data[0], StatusCode, Remark, TicketNo, UpdtUsrId)
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
  //-----------Atul----------21042020-------//
  async getHelpMasterPortal(CompCode): Promise<any> {
    try {
      let query = `CALL spGetHelpMasterPortal (?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
  async getFAQMasterPortal(CompCode): Promise<any> {
    try {
      let query = `CALL spGetFAQMasterPortal (?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async insUpdtHelpCenter(data: any): Promise<any> {
    try {
      let query = `CALL spInsUpdtHelpCenter (?,?,?,?,?,?,?,?,?)`;
      //return await this.conn.query(query);
      const res = await this.conn.query(query, [
        data.CompCode,
        data.InsUpdtType,
        data.Id,
        data.HelpTitle,
        data.HelpDesc,
        data.IsAllowFeedback,
        data.DisplayFor,
        data.IsActive,
        data.updt_usrId,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      console.log(error.message);
      throw new InternalServerErrorException();
    }
  }
  async insUpdtFAQCenter(data: any): Promise<any> {
    try {
      let query = `CALL spInsUpdtFAQCenter (?,?,?,?,?,?,?)`;
      //return await this.conn.query(query);
      const res = await this.conn.query(query, [
        data.CompCode,
        data.InsUpdtType,
        data.Id,
        data.Question,
        data.Answer,
        data.IsActive,
        data.updt_usrId,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      console.log(error.message);
      throw new InternalServerErrorException();
    }
  }

  async getFAQGrpUsrmapp(CompCode, GroupCode, UserType): Promise<any> {
    try {
      let query = `CALL spGetFAQGroupUserTypeMapp (?,?,?)`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query, [
        CompCode,
        GroupCode,
        UserType,
      ]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
  async getHelpGrpUsrmapp(CompCode, GroupCode, UserType): Promise<any> {
    try {
      let query = `CALL spGetHelpGroupUserTypeMapp (?,?,?)`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query, [
        CompCode,
        GroupCode,
        UserType,
      ]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async insUpdtFaqGrpUsrmapp(data: any): Promise<any> {
    try {
      data.MappDtl.map((item) => {
        let query = `CALL spInsUpdtFAQGroupUserTypeMapp (?,?,?,?,?,?)`;
        // console.log(data)
        this.conn.query(query, [
          data.CompCode,
          data.FaqGroup,
          item.Id,
          data.UserType,
          item.IsVisible,
          data.UpdtUsrId,
        ]);
      });
      return { message: "successful", data: { rslt: "success" } };
    } catch (error) {
      this.logger.error(error);
      console.log(error.message);
      throw new InternalServerErrorException();
    }
  }

  async insUpdtHelpGrpUsrmapp(data: any): Promise<any> {
    try {
      data.MappDtl.map((item) => {
        let query = `CALL spInsUpdtHelpGroupUserTypeMapp (?,?,?,?,?,?)`;
        this.conn.query(query, [
          data.CompCode,
          data.HelpGroup,
          item.Id,
          data.UserType,
          item.IsVisible,
          data.UpdtUsrId,
        ]);
      });
      return { message: "successful", data: { rslt: "success" } };
    } catch (error) {
      this.logger.error(error);
      console.log(error.message);
      throw new InternalServerErrorException();
    }
  }
}
