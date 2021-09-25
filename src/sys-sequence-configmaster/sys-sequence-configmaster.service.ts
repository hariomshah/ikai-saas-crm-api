import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class SysSequenceConfigmasterService {
  private logger = new Logger("SysSequenceConfigmasterService");
  constructor(private readonly conn: Connection) {}

  async getSys_Sequence_ConfigMaster(CompCode): Promise<any> {
    try {
      let query = `CALL spGetSys_Sequence_ConfigMaster(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async spGetSequenceTrans(CompCode): Promise<any> {
    try {
      let query = `CALL spGetSequenceTrans(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async InsUpdtSystemSequenceConfigMaster(data: any): Promise<any> {
    try {
      let query = `CALL spInsUpdtSystemSequenceConfigMaster(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      const res = await this.conn.query(query, [
        data.CompCode,
        data.InsUpdtType,
        data.Id,
        data.TranType,
        data.ConfigType,
        data.ResetOn,
        data.Preffix,
        data.Suffix,
        data.Value,
        data.LastGenNo,
        data.EnablePadding,
        data.PaddingLength,
        data.PaddingChar,
        data.IsActive,
        data.updt_usr,
      ]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getSequenceNextVal(data: any): Promise<any> {
    try {
      let query = `CALL spGetSequenceNextVal(?,?,?)`;
      const res = await this.conn
        .query(query, [data.CompCode, data.TranType, data.updt_usr])
        .catch(async (err) => {
          throw new InternalServerErrorException(err);
        });
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  // spGetSequenceTranMaster Atul on 20200424

  async getSequenceTranMaster(CompCode): Promise<any> {
    try {
      let query = `CALL spGetSequenceTranMaster(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
