import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class HomescreenService {
  private logger = new Logger("HomescreenService");

  constructor(private readonly conn: Connection) {}

  async insUpdtHomescreenpromos(data: any): Promise<any> {
    try {
      let query = `CALL spInsUpdtHomescreenpromos (?,?,?,?,?,?,?,?,?,?,?,?,?)`;

      //return await this.conn.query(query);
      const res = await this.conn.query(query, [
        data.CompCode,
        data.InsUpdtType,
        data.Id,
        data.PromoTitle,
        data.PromoImageUri,
        data.PathType,
        data.SysOption1,
        data.SysOption2,
        data.SysOption3,
        data.SysOption4,
        data.SysOption5,
        data.IsActive,
        data.updt_usr,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
  async getHomescreenpromos(CompCode): Promise<any> {
    try {
      let query = `CALL spGetHomescreenpromos(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
}
