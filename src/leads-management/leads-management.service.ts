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
          .query("CALL spInsUpdtLeadsMaster (?,?,?,?,?,?,?,?,?)", [
            data[i].CompCode,
            data[i].LeadId,
            data[i].LeadName,
            data[i].LeadMob,
            data[i].LeadSource,
            data[i].LeadType,
            data[i].ActionTaken,
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
}
