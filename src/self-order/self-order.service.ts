import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";
import { RestaurantPosService } from "../restaurant-pos/restaurant-pos.service";
@Injectable()
export class SelfOrderService {
  private logger = new Logger("SelfOrderService");
  constructor(private readonly conn: Connection) {}

  async getConfig(CompCode): Promise<any> {
    try {
      let query = `CALL spGetConfig (?)`;
      const res = await this.conn.query(query, [CompCode]);
      console.log(CompCode)
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async fetchValidateSelfOrder(data): Promise<any> {
    try {
      let query = `CALL spValidateSelfOrder (?,?,?,?,?)`;
      const res = await this.conn.query(query, [
        data.CompCode,
        data.TableNo,
        data.TableName,
        data.SecCode,
        data.BranchCode,
      ]);
      return { message: "successful", data: [res[0], res[1], res[2], res[3]] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}

// fetchSelfOrderKOTData
