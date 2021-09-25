import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class DeptmasterService {
  private logger = new Logger("DeptmasterService");
  constructor(private readonly conn: Connection) {}

  //Dept Master
  async getDeptMaster(CompCode): Promise<any> {
    try {
      let query = `CALL spGetDeptMaster(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async InsUpdtDeptMaster(data: any): Promise<any> {
    try {
      let query = `CALL spInsUpdtDeptMaster(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      // console.log(data);
      const res = await this.conn.query(query, [
        data.CompCode,
        data.InsUpdtType,
        data.BranchCode,
        data.DeptCode,
        data.DeptName,
        data.EnablePurchase,
        data.EnablePurchaseReturn,
        data.EnableSale,
        data.EnableSaleReturn,
        data.EnableTransferIN,
        data.EnableTransferOUT,
        data.EnableAdjustments,
        data.IsActive,
        data.updt_usr,
      ]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
