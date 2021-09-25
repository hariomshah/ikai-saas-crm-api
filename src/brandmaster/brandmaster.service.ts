import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class BrandmasterService {
  private logger = new Logger("BrandmasterService");
  constructor(private readonly conn: Connection) {}

  //Brand Master
  async getBrandMaster(CompCode): Promise<any> {
    try {
      let query = `CALL spGetBrandMaster(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async InsUpdtBrandMaster(data: any): Promise<any> {
    try {
      let query = `CALL spInsUpdtBrandMaster (?,?,?,?,?,?,?)`;
      // console.log(data);
      const res = await this.conn.query(query, [
        data.CompCode,
        data.MfrCode,
        data.BrandCode,
        data.BrandDesc,
        data.IsDefault,
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

  async getBrandData(CompCode, catCode): Promise<any> {
    try {
      let query = `CALL spGetBrandData(?,?)`;
      const res = await this.conn.query(query, [CompCode, catCode]);
      // console.log(res)
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
}
