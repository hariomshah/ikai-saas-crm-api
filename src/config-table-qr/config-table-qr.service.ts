import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class ConfigTableQrService {
  private logger = new Logger("PromotionService");
  constructor(private readonly conn: Connection) { }

  async getConfigureTableQR(CompCode, BranchCode, DeptCode): Promise<any> {
    try {
      let query = `Call spGetConfigTableQR(?,?,?)`;
      const res = await this.conn.query(query, [
        CompCode,
        BranchCode,
        DeptCode,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async InsConfigureTableQR(data: any): Promise<any> {
    try {
      let query = `CALL spInsConfigTableQRCode(?,?,?,?,?,?,?,?,?)`;
      console.log(data);
      const res = await this.conn.query(query, [
        data.CompCode,
        data.BranchCode,
        data.DeptType,
        data.TableSecCode,
        data.TableCode,
        data.TableName,
        data.SecretKey,
        data.IsActive,
        data.updt_usr,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      return { message: "unsuccessful", data: error };
      throw new InternalServerErrorException();
    }
  }

  async UpdtConfigureTableQR(data: any): Promise<any> {
    try {
      let query = `CALL spUpdtConfigTableQRCode(?,?,?,?,?,?,?,?,?)`;
      console.log(data);
      const res = await this.conn.query(query, [
        data.CompCode,
        data.BranchCode,
        data.DeptType,
        data.TableSecCode,
        data.TableCode,
        data.TableName,
        data.SecretKey,
        data.IsActive,
        data.updt_usr,
      ]).catch(er => {
        console.log(er)
      });
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      return { message: "unsuccessful", data: error };
      throw new InternalServerErrorException();
    }
  }
}
