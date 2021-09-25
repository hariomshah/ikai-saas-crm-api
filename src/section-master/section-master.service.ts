import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class SectionMasterService {
  private logger = new Logger("SectionMasterService");
  constructor(private readonly conn: Connection) { }

  //Section Master
  async getSectionMaster(CompCode): Promise<any> {
    try {
      let query = `CALL spGetSectionMaster(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async InsUpdtSectionMaster(data: any): Promise<any> {
    try {
      let query = `CALL spInsUpdtSectionMaster(?,?,?,?,?,?,?,?)`;
        
      const res = await this.conn.query(query, [
        data.CompCode,
        data.SecCode,
        data.BranchCode,
        data.SecDesc,
        data.ImageURL,
        data.pathType === null ? "U" : data.pathType,
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

  // Atul 04/08/2020

  async getSectionMasterCardData(CompCode, SecCode): Promise<any> {
    try {
      let query = `CALL spGetSectionMasterCard(?,?)`;
      const res = await this.conn.query(query, [CompCode, SecCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
