import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { template } from "lodash";
import { Connection } from "typeorm";

@Injectable()
export class KeyboardHotkeyConfigService {
  private logger = new Logger("KeyboardHotkeyConfigService");
  constructor(private readonly conn: Connection) {}

  async getKeyboardHotConfig(CompCode): Promise<any> {
    try {
      let query = `CALL spGetDataKeyboardHotKeyConfig(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async UpdtHotKeyConfigDtl(data: any): Promise<any> {
    try {
      // console.log(data, "keybaor");
      let query = `CALL spUpdtHotKeyConfigDtl (?,?,?,?,?,?,?,?)`;
      if (data.keyboardData && data.keyboardData.length > 0) {
        data.keyboardData.map(async (item) => {
          if (item.isDirty === true) {
            const res = await this.conn.query(query, [
              data.CompCode,
              item.CompId,
              item.EventSrNo,
              item.EventCode,
              item.EventName,
              item.HotKey,
              item.OrderBy,
              item.updt_usrId,
            ]);
          }
        });
      }
      return { message: "successful" };
    } catch (error) {
      this.logger.error(error);
      return { message: "unsuccessful", data: error };
      throw new InternalServerErrorException();
    }
  }
}
