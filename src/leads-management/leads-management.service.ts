import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class LeadsManagementService {
  private logger = new Logger("LeadsManagementService");
  constructor(private readonly conn: Connection) {}

  async getLeadsMaster(CompCode): Promise<any> {
    try {
      let query = `call spGetDataLeadMaster(?);`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getDataLeadsDashboard(CompCode): Promise<any> {
    try {
      let query = `call spGetDataLeadsDashboard(?);`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async insUpdtLeadsMaster(data: any): Promise<any> {
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let resData: any;
      let i = 0;
      for (i; i < data.length; i++) {
        resData = await queryRunner
          .query("CALL spInsUpdtLeadsMaster (?,?,?,?,?,?,?,?,?,?)", [
            data[i].CompCode,
            data[i].LeadId,
            data[i].LeadName,
            data[i].LeadMob,
            data[i].LeadSource,
            data[i].LeadType,
            data[i].ActionTaken,
            data[i].Remark,
            data[i].LeadGenratedThrough,
            data[i].updt_usrId,
          ])
          .catch(async (err) => {
            throw new InternalServerErrorException(err);
          });
      }

      await queryRunner.commitTransaction();
      return { message: "successful" };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async getDataListOfRMsAndCaller(CompCode): Promise<any> {
    try {
      let query = `call spGetDataListOfRMsAndCaller(?);`;
      const res = await this.conn.query(query, [CompCode]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  //spInsUpdtLeadsActionHdr
  async insUpdtLeadAssignAndTransfer(data: any): Promise<any> {
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let resData;

      let i = 0;

      console.log(data.LeadAction);
      for (i; i < data.LeadAction.length; i++) {
        resData = await queryRunner
          .query("CALL spInsUpdtLeadAssignAndTransfer (?,?,?,?,?,?,?,?)", [
            data.CompCode,
            data.LeadAction[i].LeadActionId,
            data.LeadAction[i].LeadId,
            data.LeadAction[i].TranType,
            data.LeadAction[i].ActionStatus,
            data.LeadAction[i].FromUserId,
            data.LeadAction[i].AssignedUserId,
            data.updt_usrId,
          ])
          .catch(async (err) => {
            console.log(err);
            throw new InternalServerErrorException(err);
          });
      }

      await queryRunner.commitTransaction();
      return { message: "successful" };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      return { message: "unsuccessful" };
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  // spGetDataAssign_and_Transfer_Leads
  async getDataAssign_and_Transfer_Leads(
    CompCode,
    TranType,
    TranMode
  ): Promise<any> {
    try {
      let query = `call spGetDataAssign_and_Transfer_Leads(?,?,?);`;
      const res = await this.conn.query(query, [CompCode, TranType, TranMode]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  // spGetDataLeadsActionStatus
  async getDataLeadsActionStatus(CompCode): Promise<any> {
    try {
      let query = `call spGetDataLeadsActionStatus(?);`;
      const res = await this.conn.query(query, [CompCode]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  // spGetDataCRMLoanType

  async getDataCRMLoanType(CompCode): Promise<any> {
    try {
      let query = `call spGetDataCRMLoanType(?);`;
      const res = await this.conn.query(query, [CompCode]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  // spGetDataLeadsPriority

  async getDataLeadsPriority(CompCode): Promise<any> {
    try {
      let query = `call spGetDataLeadsPriority(?);`;
      const res = await this.conn.query(query, [CompCode]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  // spGetDataLeadsDetails
  async getDataLeadsHistoryDetails(CompCode, LeadId): Promise<any> {
    try {
      let query = `call spGetDataLeadsHistoryDetails(?,?);`;
      const res = await this.conn.query(query, [CompCode, LeadId]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  // spGetLeadsDataCallerRM
  async getLeadsDataCallerRM(CompCode, TranType, TranUser): Promise<any> {
    try {
      let query = `call spGetLeadsDataCallerRM(?,?,?);`;
      const res = await this.conn.query(query, [CompCode, TranType, TranUser]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  // spValidateLeadId
  async validateLeadId(CompCode, LeadId): Promise<any> {
    try {
      let query = `call spValidateLeadId(?,?);`;
      const res = await this.conn.query(query, [CompCode, LeadId]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  // spGetLeadsViewData
  async getLeadsViewData(CompCode, LeadId): Promise<any> {
    try {
      let query = `call spGetLeadsViewData(?,?);`;
      const res = await this.conn.query(query, [CompCode, LeadId]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  // spGetLeadsViewData
  async getDataCRM_RMCallerDashboard(
    CompCode,
    TranType,
    FromDate,
    ToDate
  ): Promise<any> {
    try {
      let query = `call spGetDataCRM_RMCallerDashboard(?,?,?,?);`;
      const res = await this.conn.query(query, [
        CompCode,
        TranType,
        FromDate,
        ToDate,
      ]);
      // console.log(res[0], "res[0]");
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async updtLeadsActionHdr(data: any): Promise<any> {
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // console.log(data, "data");
      await queryRunner.query(
        "CALL spUpdateLeadActionHdr (?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          data.CompCode,
          data.LeadId,
          data.LeadActionId,
          data.TranType,
          data.ActionStatus,
          data.NextScheduleDateTime,
          data.SysOption1,
          data.SysOption2,
          data.SysOption3,
          data.SysOption5,
          data.Remark,
          data.UpdtUsrId,
        ]
      );

      await queryRunner.commitTransaction();
      return { message: "successful" };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  // spGetCRMEmployeePerformanceDashboard
  async getCRMEmployeePerformanceDashboard(pCompCode): Promise<any> {
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // console.log(data,"data")
      await queryRunner.query("CALL spGetCRMEmployeePerformanceDashboard (?)", [
        pCompCode,
      ]);

      await queryRunner.commitTransaction();
      return { message: "successful" };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async getDataCRMCallerRMPerformance(
    pCompCode,
    pFromDate,
    pToDate
  ): Promise<any> {
    try {
      let query = `call spGetDataCRMCallerRMPerformance(?,?,?)`;
      const res = await this.conn.query(query, [pCompCode, pFromDate, pToDate]);
      // let userData = null;
      // if (res[0] && res[0].length > 0 && res[1] && res[1].length > 0) {
      // }
      return { message: "successful", data: res };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
