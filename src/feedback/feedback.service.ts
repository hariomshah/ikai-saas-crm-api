import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class FeedbackService {
  private logger = new Logger("FeedBackService");
  constructor(private readonly conn: Connection) {}

  async getFeedBackData(CompCode,OrderId, ScheduleId): Promise<any> {
    try {
      let query = `Call spGetFeedBackTran(?,?,?);`;
      const res = await this.conn.query(query, [CompCode,OrderId, ScheduleId]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
}
