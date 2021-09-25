import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class TransactionTypeMasterService {
  private logger = new Logger("TransactionTypeMasterService");
  constructor(private readonly conn: Connection) {}

  async getTransactionTypeMaster(CompCode): Promise<any> {
    try {
      let query = `CALL spGetTransactionTypeMaster(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getTranTypeConfigData(CompCode,pBranchCode, pTranTypeCode): Promise<any> {
    try {
      let query = `CALL spGetTranTypeConfig(?,?,?)`;
      const res = await this.conn.query(query, [CompCode,pBranchCode, pTranTypeCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async InsUpdtTransactionTypeConfig(data: any): Promise<any> {
    try {
      // console.log(data);
      let query = `CALL spInsUpdtTransactionTypeConfig (?,?,?,?,?,?,?,?,?,?,?,?)`;
      //return await this.conn.query(query);
      const res = await this.conn.query(query, [
        data.CompCode,
        data.BranchCode,
        data.TranTypeCode,
        data.ConfigCode,
        data.ConfigDesc,
        data.SysOption1,
        data.SysOption2,
        data.SysOption3,
        data.SysOption4,
        data.SysOption5,
        data.IsActive,
        data.UpdtUsr,
      ]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      return { message: "unsuccessful", data: error };
      throw new InternalServerErrorException();
    }
  }

  async DeleteTransactionTypeConfig(data: any): Promise<any> {
    try {
      // console.log(data);
      let query = `CALL spDeleteTransactionTypeConfig (?,?,?,?)`;
      //return await this.conn.query(query);
      const res = await this.conn.query(query, [
        data.CompCode,
        data.BranchCode,
        data.TranTypeCode,
        data.ConfigCode,
      ]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      return { message: "unsuccessful", data: error };
      throw new InternalServerErrorException();
    }
  }
}
