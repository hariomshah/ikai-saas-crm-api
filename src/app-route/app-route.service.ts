import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class AppRouteService {
  private logger = new Logger("AppLayoutService");
  constructor(private readonly conn: Connection) {}

  async getAppRouteHdr(CompCode): Promise<any> {
    try {
      let query = `CALL spGetAppRouteHdr(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getAppRouteDtl(CompCode, RouteId): Promise<any> {
    try {
      let query = `CALL spGetAppRouteDtl(?,?)`;
      const res = await this.conn.query(query, [CompCode, RouteId]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getFilterFieldTypeDefination(CompCode): Promise<any> {
    try {
      let query = `CALL spGetDataFilterFieldTypeDefination(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async insUpdtAppRoute(data): Promise<any> {
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //Insert Hdr
      let l_hdrRes = await queryRunner
        .query("CALL spInsUpdtAppRouteHdr(?,?,?,?,?,?)", [
          data.AppRouteHdr.CompCode,
          data.AppRouteHdr.RouteId,
          data.AppRouteHdr.RouteName,
          data.AppRouteHdr.RouteSlug,
          data.AppRouteHdr.IsActive,
          data.AppRouteHdr.UpdtUsr,
        ])
        .catch(async (err) => {
          console.log(err, "spInsUpdtAppRouteHdr");
          this.logger.error(err);
          await queryRunner.rollbackTransaction();
        });

      let l_RouteId = l_hdrRes[0][0].RouteId;

      //Delete AppRoutePrevDtlData if exist
      if (data.AppRoutePrevDtlData.length > 0) {
        let i = 0;
        for (i; i < data.AppRoutePrevDtlData.length; i++) {
          await queryRunner
            .query("CALL spDeleteAppRouteDtl(?,?,?)", [
              data.AppRouteHdr.CompCode,
              l_RouteId,
              data.AppRoutePrevDtlData[i].Id,
            ])
            .catch(async (err) => {
              console.log(err);
              this.logger.error(err);
              await queryRunner.rollbackTransaction();
            });
        }
      }

      //Insert App Route Detail
      let i = 0;
      for (i; i < data.AppRouteDtl.length; i++) {
        await queryRunner
          .query("CALL spInsAppRouteDtl(?,?,?,?,?,?)", [
            data.AppRouteHdr.CompCode,
            l_RouteId,
            data.AppRouteDtl[i].FieldType,
            data.AppRouteDtl[i].FieldValue,
            data.AppRouteDtl[i].DataType,
            data.AppRouteHdr.UpdtUsr,
          ])
          .catch(async (err) => {
            console.log(err);
            this.logger.error(err);
            await queryRunner.rollbackTransaction();
          });
      }

      await queryRunner.commitTransaction();
      return {
        message: "successful",
        data: {
          RouteId: l_RouteId,
        },
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
