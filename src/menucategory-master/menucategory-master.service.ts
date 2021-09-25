import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";
@Injectable()
export class MenucategoryMasterService {
  private logger = new Logger("MenucategoryMasterService ");
  constructor(private readonly conn: Connection) {}

  async getMenuCategoryMaster(CompCode): Promise<any> {
    try {
      let query = `CALL spGetMenuCategoryMaster(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async InsUpdtMenuCategoryMaster(data: any): Promise<any> {
    try {
      let query = `CALL spInsUpdtMenuCategoryMaster(?,?,?,?,?,?,?,?,?,?,?)`;
      console.log(data);
      const res = await this.conn.query(query, [
        data.CompCode,
        data.InsUpdtType,
        data.MenuCatCode,
        data.MenuCatName,
        data.MenuCatDesc,
        data.ImageURL,
        data.pathType === null ? "U" : data.pathType,
        data.DefHSNSACCode,
        data.IsActive,
        data.updt_usrId,
        data.TaxCode,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      return { message: "unsuccessful", data: error };
      throw new InternalServerErrorException();
    }
  }
}
