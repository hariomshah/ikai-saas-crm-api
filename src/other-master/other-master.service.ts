import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class OtherMasterService {
  private logger = new Logger("OtherMasterService");

  constructor(private readonly conn: Connection) { }
  async getOtherMaster(CompCode, MasterType): Promise<any> {
    try {
      let query = `CALL spGetOtherMaster(?,?,?)`;
      const res = await this.conn.query(query, [CompCode, MasterType, false]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async insUpdtOtherMaster(data: any): Promise<any> {
    try {
      // console.log(data);
      let query = `CALL spInsUpdtOtherMaster (?,?,?,?,?,?,?,?,?,?,?,?,?)`;

      //return await this.conn.query(query);
      const res = await this.conn.query(query, [
        data.CompCode,
        data.InsUpdtType,
        data.Id,
        data.MasterType,
        data.ShortCode,
        data.MasterDesc,
        data.updt_usr,
        data.IsActive,
        data.SysOption1 ? data.SysOption1 : null,
        data.SysOption2 ? data.SysOption2 : null,
        data.SysOption3 ? data.SysOption3 : null,
        data.SysOption4 ? data.SysOption4 : null,
        data.SysOption5 ? data.SysOption5 : null,
      ]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      return { message: "unsuccessful", data: error };
      // throw new InternalServerErrorException();
    }
  }
}
