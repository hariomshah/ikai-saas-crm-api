import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class ClassMasterService {
  private logger = new Logger("ClassMasterService");
  constructor(private readonly conn: Connection) {}

  async getClassMaster(CompCode): Promise<any> {
    try {
      let query = `CALL spGetClassMaster(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async InsUpdtClassMaster(data: any): Promise<any> {
    try {
      let query = `CALL spInsUpdtClassMaster(?,?,?,?,?,?,?)`;
      // console.log(data);
      const res = await this.conn.query(query, [
        data.CompCode,
        data.InsUpdtType,
        data.ClassId,
        data.ClassCode,
        data.ClassName,
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
}
