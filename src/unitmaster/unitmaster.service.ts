import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class UnitmasterService {
  private logger = new Logger("UnitmasterService");
  constructor(private readonly conn: Connection) {}

  async getUnitMaster(CompCode): Promise<any> {
    try {
      let query = `CALL spGetUnitMaster(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async InsUpdtUnitMaster(data: any): Promise<any> {
    try {
      let query = `CALL spInsUpdtUnitMaster (?,?,?,?,?,?,?,?)`;
        // console.log(data)
      const res = await this.conn.query(query, [
       data.CompCode,
        data.UnitCode,
        data.UnitDesc,
        data.ParentUnitCode,
        data.UnitMeasureToParent,
        data.AllowDecimal,
        data.IsActive,
        data.updt_usrId,
      ]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
