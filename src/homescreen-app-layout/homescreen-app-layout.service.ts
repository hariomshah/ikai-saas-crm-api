import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class HomescreenAppLayoutService {
  private logger = new Logger("HomeScreenAppLayoutService");
  constructor(private readonly conn: Connection) {}

  //HomeScreenAppLayout
  async getHomeScreenAppLayout(CompCode): Promise<any> {
    try {
      let query = `CALL spGetHomeScreenAppLayout(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  //HomeScreenAppLayoutDtl
  async getHomeScreenAppLayoutDtl(CompCode): Promise<any> {
    try {
      let query = `CALL spGetHomeScreenAppLayoutDtl(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async InsUpdtHomeScreenAppLayout(data: any): Promise<any> {
    try {
      let query = `CALL spInsUpdtHomeScreenAppLayout (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      const res = await this.conn.query(query, [
        data.CompCode,
        data.LayoutId,
        data.LayoutTitle,
        data.LayoutType,
        data.FrameHeight,
        data.AutoPlay,
        data.AutoPlayDuration,
        data.CmptHeight,
        data.CmptWidth,
        data.CmptShowTitle,
        data.OrderBy,
        data.IsActive,
        data.updt_usr,
      ]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async InsUpdtHomeScreenAppLayoutDtl(data: any): Promise<any> {
    try {
      let query = `CALL spInsUpdtHomeScreenAppLayoutDtl (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      const res = await this.conn.query(query, [
        data.CompCode,
        data.Id,
        data.LayoutId,
        data.PromoTitle,
        data.PromoImageUri,
        data.pathType,
        data.SysOption1,
        data.SysOption2,
        data.SysOption3,
        data.SysOption4,
        data.SysOption5,
        data.OrderBy,
        data.IsActive,
        data.updt_usr,
      ]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
}
