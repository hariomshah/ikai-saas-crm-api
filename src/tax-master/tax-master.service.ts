import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { compact } from "lodash";
import { Connection } from "typeorm";

@Injectable()
export class TaxMasterService {
  private logger = new Logger("StateMasterService");

  constructor(private readonly conn: Connection) {}

  async getTaxMaster(CompCode): Promise<any> {
    try {
      let query = `CALL spGetTaxMaster (?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async InsUpdtTaxMaster(data: any): Promise<any> {
    try {
      // console.log(data);
      let query = `CALL spInsUpdtTaxMaster (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

      //return await this.conn.query(query);
      const res = await this.conn.query(query, [
        data.CompCode,
        data.TaxCode,
        data.TaxName,
        data.TaxType,
        data.TranType,
        data.TaxPer,
        data.IGSTPer,
        data.CGSTPer,
        data.SGSTPer,
        data.UTSTPer,
        data.CESSPer,
        data.SURCHARGPer,
        data.IsActive,
        data.updt_usrId,
      ]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      return { message: "unsuccessful", data: error };
      throw new InternalServerErrorException(
        { message: "unsuccessful", data: error },
        error
      );
    }
  }
}
