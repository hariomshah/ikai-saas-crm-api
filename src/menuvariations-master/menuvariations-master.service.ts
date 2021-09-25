import {
    Injectable,
    InternalServerErrorException,
    Logger,
  } from "@nestjs/common";
  import { Connection } from "typeorm";

@Injectable()
export class MenuvariationsMasterService {
    private logger = new Logger("MenuvariationsMasterService");
    constructor(private readonly conn: Connection) {}

    async getMenuVariations(CompCode): Promise<any> {
        try {
          let query = `CALL spGetMenuVariations(?)`;
          const res = await this.conn.query(query, [CompCode]);
          return { message: "successful", data: res[0] };
        } catch (error) {
          this.logger.error(error);
          throw new InternalServerErrorException();
        }
      }
}
