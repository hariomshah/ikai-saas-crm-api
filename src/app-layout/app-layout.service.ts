import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class AppLayoutService {
  private logger = new Logger("AppLayoutService");
  constructor(private readonly conn: Connection) {}
  //AppLayout
  async getAppLayout(CompCode, DeviceType): Promise<any> {
    try {
      let query = `CALL spGetAppLayout(?,?)`;
      const res = await this.conn.query(query, [CompCode, DeviceType]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  //AppLayoutDtl
  async getAppLayoutDtl(CompCode, DeviceType): Promise<any> {
    try {
      let query = `CALL spGetAppLayoutDtl(?,?)`;
      const res = await this.conn.query(query, [CompCode, DeviceType]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async InsUpdtAppLayout(data: any): Promise<any> {
    try {
      // console.log(data);
      let query = `CALL spInsUpdtAppLayout (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      const res = await data.map((aa) => {
        this.conn.query(query, [
          aa.CompCode,
          aa.DeviceType,
          aa.LayoutId,
          aa.LayoutTitle,
          aa.LayoutType,
          aa.SysOption1,
          aa.SysOption2,
          aa.SysOption3,
          aa.SysOption4,
          aa.SysOption5,
          aa.SysOption6,
          aa.SysOption7,
          aa.SysOption8,
          aa.SysOption9,
          aa.SysOption10,
          aa.SysOption11,
          aa.SysOption12,
          aa.SysOption13,
          aa.SysOption14,
          aa.SysOption15,
          aa.SysOption16,
          aa.SysOption17,
          aa.SysOption18,
          aa.SysOption19,
          aa.SysOption20,
          aa.OrderBy,
          aa.IsActive,
          aa.updt_usr,
        ]);
      });

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async InsUpdtAppLayoutDtl(data: any): Promise<any> {
    try {
      let query = `CALL spInsUpdtAppLayoutDtl (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      const res = await data.map((aa) => {
        return this.conn.query(query, [
          aa.CompCode,
          aa.DeviceType,
          aa.Id,
          aa.LayoutId,
          aa.PromoTitle,
          aa.PromoImageUri,
          aa.pathType,
          aa.RouteCode,
          aa.SysOption1,
          aa.SysOption2,
          aa.SysOption3,
          aa.SysOption4,
          aa.SysOption5,
          aa.OrderBy,
          aa.IsActive,
          aa.updt_usr,
        ]);
      });

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //AppLayoutConfigHdr
  async getLayoutTypeConfigHdr(CompCode): Promise<any> {
    try {
      let query = `CALL spGetLayoutTypeConfigHdr(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  //AppLayoutConfigDtl
  async getLayoutTypeConfigDtl(CompCode, LayoutTypeCode): Promise<any> {
    try {
      let query = `CALL spGetLayoutTypeConfigDtl(?,?)`;
      const res = await this.conn.query(query, [CompCode, LayoutTypeCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async deleteAppLayoutHdr(data): Promise<any> {
    // console.log(data.length, "deleting data");
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      console.log(data, "on start");

      const res = await queryRunner
        .query("CALL spDeleteAppLayoutHdr(?,?)", [data.CompCode, data.LayoutId])
        .catch(async (err) => {
          throw new InternalServerErrorException(err);
        });

      await queryRunner.commitTransaction();
      return { message: "successful", res };
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async deleteAppLayoutDtl(data): Promise<any> {
    // console.log(data.length, "deleting data");
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      console.log(data, "on start");
      const res = await queryRunner
        .query("CALL spDeleteAppLayouteDtl(?,?,?)", [
          data.CompCode,
          data.LayoutId,
          data.Id,
        ])
        .catch(async (err) => {
          throw new InternalServerErrorException(err);
        });

      await queryRunner.commitTransaction();
      return { message: "successful", res };
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
