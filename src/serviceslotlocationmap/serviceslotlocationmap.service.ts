import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class ServiceslotlocationmapService {
  private logger = new Logger("ServiceslotlocationmapService");

  constructor(private readonly conn: Connection) {}
  async insUpdtservice_slot_loc_mapp(data: any): Promise<any> {
    try {
      // console.log(data);
      data.forEach((row) => {
        let query = `CALL spInsUpdtservice_slot_loc_mapp (?,?,?,?,?,?)`;
        this.conn.query(query, [
          row.CompCode,
          row.ServiceId,
          row.SlotId,
          row.LocationId,
          row.IsActive,
          row.updt_usrId,
        ]);
      });

      return { message: "successful", data: "saved successfully" };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
  async getServiceSlotLocMapp(CompCode): Promise<any> {
    try {
      let query = `CALL spGetServiceSlotLocMapp (?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
}
