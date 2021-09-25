import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class TablesMasterService {
  private logger = new Logger("TablesMasterService");
  constructor(private readonly conn: Connection) {}

  async getTablesMaster(CompCode): Promise<any> {
    try {
      let query = `CALL spGetTablesMaster(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  async InsUpdtTablesMaster(data: any): Promise<any> {
    try {
      let query = `CALL spInsUpdtTablesMaster(?,?,?,?,?,?,?,?,?)`;
      // console.log(data);
      const res = await this.conn.query(query, [
        data.CompCode,
        data.InsUpdtType,
        data.ShortCode,
        data.TableName,
        data.SecCode,
        data.Icon,
        data.SittingCapacity,
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
