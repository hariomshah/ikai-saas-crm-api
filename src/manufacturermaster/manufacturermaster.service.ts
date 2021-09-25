import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class ManufacturermasterService {
  private logger = new Logger("ManufacturermasterService");
  constructor(private readonly conn: Connection) {}

  //Category Master
  async getManufacturerMaster(CompCode): Promise<any> {
    try {
      let query = `CALL spGetManufacturerMaster(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async InsUpdtManufacturerMaster(data): Promise<any> {
    try {
      let query = `CALL spInsUpdtManufacturerMaster(?,?,?,?,?,?)`;
      const res = await this.conn.query(query, [
        data.CompCode,
        data.InsUpdtType,
        data.MfrCode,
        data.MfrDesc,
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

  async getMFRData(CompCode,mfrCode): Promise<any> {
    try {
      let query = `CALL spGetMFRData(?,?)`;
      const res = await this.conn.query(query, [CompCode,mfrCode]);
      // console.log(res)
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
}
