import { Injectable,
    InternalServerErrorException,
    Logger
 } from '@nestjs/common';
 import { Connection } from "typeorm";

@Injectable()
export class StateMasterService {
    private logger = new Logger("StateMasterService");

  constructor(private readonly conn: Connection) {}
  async getStateMasterData(CompCode): Promise<any> {
    try {
      let query = `CALL spGetStateMasterData (?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
  async insUpdtStateMaster(data: any): Promise<any> {
    try {
      // console.log(data);
      let query = `CALL spInsUpdtStateMaster (?,?,?,?,?,?,?,?,?,?)`;

      //return await this.conn.query(query);
      const res = await this.conn.query(query, [
        data.CompCode,
        data.InsUpdtType,
        data.CountryCode,	
        data.StateCode,	
        data.StateName,	
        data.StateCode2Char,	
        data.IsDefault,	
        data.IsActive,	
        data.GSTStateCode,
        data.updt_usrId,      
      ]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
}
