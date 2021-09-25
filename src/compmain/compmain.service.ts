import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class CompmainService {
  private logger = new Logger("CompMainService");
  constructor(private readonly conn: Connection) {}

  async getCompMain(CompCode): Promise<any> {
    try {
      let query = `CALL spGetCompMain(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async UpdtCompMain(data: any): Promise<any> {
    try {
      let query = `CALL spUpdtCompMain (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      // console.log(data);
      const res = await this.conn.query(query, [
        data.CompCode,
        data.compShortName,
        data.compName,
        data.validity,
        data.address1,
        data.address2,
        data.address3,
        data.City,
        data.Pin,
        data.Country,
        data.GST,
        data.PAN,
        data.ContantPerson,
        data.Directors,
        data.tel,
        data.tel2,
        data.mobile,
        data.email,
        data.website,
        data.updt_usr,
      ]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      return { message: "unsuccessful", data: error };
      throw new InternalServerErrorException();
    }
  }
}
