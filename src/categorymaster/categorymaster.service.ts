import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class CategorymasterService {
  private logger = new Logger("CategorymasterService");
  constructor(private readonly conn: Connection) {}

  //Category Master
  async getCategoryMaster(CompCode): Promise<any> {
    try {
      let query = `CALL spGetCategoryMaster(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async InsUpdtCategoryMaster(data): Promise<any> {
    try {
      let query = `CALL spInsUpdtCategoryMaster(?,?,?,?,?,?,?,?,?)`;

      const res = await this.conn.query(query, [
        data.CompCode,
        data.InsUpdtType,
        data.CatCode,
        data.CatDesc,
        data.CatDetailDesc,
        data.ImageUrl,
        data.pathType,
        data.IsActive,
        data.UpdtUsr,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      return { message: "unsuccessful", data: error };
      throw new InternalServerErrorException();
    }
  }

  async getCatMaster(CompCode,catCode): Promise<any> {
    try {
      let query = `CALL spGetCatMaster(?,?)`;
      const res = await this.conn.query(query, [CompCode,catCode]);
      // console.log(res)
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
}
