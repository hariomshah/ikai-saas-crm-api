import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class AppLayoutUsersService {
  private logger = new Logger("AppLayoutService");
  constructor(private readonly conn: Connection) {}
  async getAppLayout(CompCode, DeviceType): Promise<any> {
    console.log(CompCode, DeviceType);
    try {
      let appLayout = `CALL spGetAppLayout(?,?)`;
      const appLayoutres = await this.conn
        .query(appLayout, [CompCode, DeviceType])
        .catch((err) => {
          throw err;
        });

      let appLayoutDtl = `CALL spGetAppLayoutDtl(?,?)`;
      const appLayoutDtlres = await this.conn
        .query(appLayoutDtl, [CompCode, DeviceType])
        .catch((err) => {
          throw err;
        });

      let Data = await appLayoutres[0].map((aa) => {
        return {
          ...aa,
          Details: appLayoutDtlres[0].filter(
            (bb) => bb.LayoutId === aa.LayoutId
          ),
        };
      });
      console.log(Data, "Data");
      return { message: "successful", data: Data };
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
}
