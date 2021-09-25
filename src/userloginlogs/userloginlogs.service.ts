import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class UserloginlogsService {
  private logger = new Logger("ConfigService");

  constructor(private readonly conn: Connection) {}
  async getUserloginlogs(CompCode, FromDate, ToDate): Promise<any> {
    try {
      let query = `CALL spGetUserloginlogs (?,?,?)`;
      const res = await this.conn.query(query, [CompCode, FromDate, ToDate]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
}
