import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class ConfigService {
  private logger = new Logger("ConfigService");
  constructor(private readonly conn: Connection) { }

  async getConfig(CompCode): Promise<any> {
    try {
      let query = `CALL spGetConfig (?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async updtConfig(data: any): Promise<any> {
    try {
      console.log(data)
      data.Config.map((item) => {
        // console.log(item);
        let query = `CALL spUpdtConfig (?,?,?,?,?)`;
        this.conn.query(query, [
          data.CompCode,
          item.ConfigCode,
          item.Value1,
          item.Value2,
          data.UpdtUsrId,
        ]).catch(err => { throw err });
      });
      return { message: "successful", data: { rslt: "success" } };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getConfigData(CompCode): Promise<any> {
    try {
      let query = `CALL spGetConfigData(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
