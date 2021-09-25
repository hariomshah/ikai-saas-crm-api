import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class CitymasterService {
  private logger = new Logger("CitymasterService");

  constructor(private readonly conn: Connection) {}

  async getCityMasterData(CompCode): Promise<any> {
    try {
      let query = `CALL spGetCityMasterData (?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
  async insUpdtCityMaster(data: any): Promise<any> {
    try {
      let query = `CALL spInsUpdtCityMaster (?,?,?,?,?,?,?,?,?,?,?)`;

      //return await this.conn.query(query);
      console.log(data)
      const res = await this.conn.query(query, [
        data.CompCode,
        data.InsUpdtType,
        data.CityCode,
        data.CityName,
        data.CountryCode,
        data.StateCode,
        data.lat,
        data.lng,
        data.IsDefault,
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
