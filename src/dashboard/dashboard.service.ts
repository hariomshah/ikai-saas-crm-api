import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class DashboardService {
  private logger = new Logger("DashboardService");

  constructor(private readonly conn: Connection) {}

  async getDashboardLayout(CompCode): Promise<any> {
    try {
      let query = `CALL spGetDashboardLayout (?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getDashboardConfig(CompCode): Promise<any> {
    try {
      let query = `CALL spGetDashboardConfig (?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getDashboardLayoutConfigMapp(CompCode): Promise<any> {
    try {
      let query = `CALL spGetDataLayoutConfigMapp (?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getComponentDataSourceQuery(query): Promise<any> {
    try {
      // let query = data.query;
      // let param = [];
      // data.parameter.forEach(element => {
      //     param.push(element.data)
      // });
      // console.log(query)
      const res = await this.conn.query(query);
      // console.log(res)
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
}
