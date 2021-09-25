import {
  Injectable,
  InternalServerErrorException,
  Logger
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class LocationmasterService {
  private logger = new Logger("LocationmasterService");

  constructor(private readonly conn: Connection) {}
  async insUpdtLocationMaster(data: any): Promise<any> {
    try {
      // console.log(data);
      let query = `CALL spInsUpdtLocationMaster (?,?,?,?,?,?)`;

      //return await this.conn.query(query);
      const res = await this.conn.query(query, [
        data.CompCode,
        data.InsUpdtType,
        data.LocationId,
        data.LocationName,
        data.IsActive,
        data.updt_usr
      ]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getLocations(CompCode): Promise<any> {
    try {
      let query = `CALL spGetLocations (?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
}
