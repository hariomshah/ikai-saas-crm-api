import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { compact } from "lodash";
import { Connection } from "typeorm";

@Injectable()
export class SupplierMasterService {
  private logger = new Logger("SupplierMasterService");

  constructor(private readonly conn: Connection) {}
  async getSupplierMaster(CompCode): Promise<any> {
    try {
      let query = `CALL spGetSupplierMaster (?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      return { message: "unsuccessful" };
      throw new InternalServerErrorException();
    }
  }

  async InsUpdtSupplierMaster(data: any): Promise<any> {
    try {
      // console.log(data);
      let query = `CALL spInsUpdtSupplierMaster (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

      //return await this.conn.query(query);
      const res = await this.conn.query(query, [
        data.CompCode,
        data.suppCode,
        data.suppName,
        data.suppType,
        data.add1,
        data.add2,
        data.add3,
        data.country,
        data.state,
        data.city,
        data.pinCode,
        data.mobileNo,
        data.emailId,
        data.chequeName,
        data.gstNo,
        data.panNo,
        data.creditDays,
        data.creditLimit,
        data.upiId,
        data.accountNo,
        data.accountHolderName,
        data.ifscCode,
        data.IsActive,
        data.updt_usr,
      ]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      return { message: "unsuccessful", data: error };
      throw new InternalServerErrorException();
    }
  }

  async getDataSuppliers(CompCode): Promise<any> {
    try {
      let query = `CALL spGetDataSuppliers (?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      return { message: "unsuccessful" };
      throw new InternalServerErrorException();
    }
  }
}
