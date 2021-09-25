import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class BranchmasterService {
  private logger = new Logger("BranchmasterService");
  constructor(private readonly conn: Connection) {}

  //Branch Master
  async getBranchMaster(CompCode): Promise<any> {
    try {
      let query = `CALL spGetBranchMaster(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async InsUpdtBranchMaster(data: any): Promise<any> {
    try {
      let query = `CALL spInsUpdtBranchMaster (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      // console.log(data);
      const res = await this.conn.query(query, [
        data.InsUpdtType,
        data.CompCode,
        data.BranchCode,
        data.BranchName,
        data.Add1,
        data.Add2,
        data.Add3,
        data.City,
        data.Pin,
        data.tel1,
        data.tel2,
        data.mobile,
        data.email,
        data.website,
        data.BranchType,
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
}
