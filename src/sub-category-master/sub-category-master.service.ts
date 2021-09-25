import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class SubCategoryMasterService {
  private logger = new Logger("StateMasterService");

  constructor(private readonly conn: Connection) {}

  async getSubCategory(CompCode): Promise<any> {
    try {
      let query = `CALL spGetSubCategory (?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async InsUpdtSubCategoryMaster(data: any): Promise<any> {
    try {
      // console.log(data);
      let query = `CALL spInsUpdtSubCategoryMaster (?,?,?,?,?,?,?,?,?,?,?,?)`;
      //return await this.conn.query(query);
      const res = await this.conn.query(query, [
        data.CompCode,
        data.SubCatCode,
        data.CatCode,
        data.SubCatDesc,
        data.SubCatDetailDesc,
        data.ImageUrl,
        data.PathType,
        data.DefHSNSACCode,
        data.ItemInfoTemplate,
        data.IsActive,
        data.IsInventory,
        data.updt_usrId,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      return { message: "unsuccessfull", data: error };
      throw new InternalServerErrorException();
    }
  }

  async getSubCatMaster(CompCode,SubCatCode): Promise<any> {
    try {
      let query = `CALL spGetSubCatMaster (?,?)`;
      const res = await this.conn.query(query, [CompCode,SubCatCode]);
      // console.log(res)
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
}
