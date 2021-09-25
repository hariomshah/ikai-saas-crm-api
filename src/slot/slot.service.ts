import {
  Injectable,
  InternalServerErrorException,
  Logger
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class SlotService {
  private logger = new Logger("SlotService");

  constructor(private readonly conn: Connection) {}
  async insUpdtSlotMaster(data: any): Promise<any> {
    try {
      // console.log(data);
      let query = `CALL spInsUpdtSlotMaster (?,?,?,?,?,?,?)`;

      //return await this.conn.query(query);
      const res = await this.conn.query(query, [
        data.CompCode,
        data.InsUpdtType,
        data.Id,
        data.SlotName,
        data.IsActive,
        data.updt_usrId,
        data.starttime
      ]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
  async getSlotMaster(CompCode): Promise<any> {
    try {
      let query = `CALL spGetSlotMaster (?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
}
