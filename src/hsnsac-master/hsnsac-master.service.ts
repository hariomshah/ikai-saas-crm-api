import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class HsnsacMasterService {
  private logger = new Logger("HSNSACmaster");

  constructor(private readonly conn: Connection) {}

  async getHSNSACmaster(CompCode): Promise<any> {
    try {
      let query = `CALL spGetHSNSACmaster (?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async InsUpdtHSNSACmaster(data: any): Promise<any> {
    
    try {
      console.log(data,"hhh");
      let query = `CALL spInsUpdtHSNSACmaster (?,?,?,?,?,?)`;

      //return await this.conn.query(query);

      const res = await this.conn.query(query, [
        data.CompCode,
        data.hsnsaccode,
        data.hsnsacdesc,
        data.DefTaxCode,
        data.IsActive,
        data.updt_usrId,
      ]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      return { message: "unsuccessful", data: error };
      throw new InternalServerErrorException();
    }
  }
}
