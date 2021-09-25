import {
  Injectable,
  InternalServerErrorException,
  Logger
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class CountryMasterService {
  private logger = new Logger("CountryMasterService");

  constructor(private readonly conn: Connection) {}

  async getCountryMasters(CompCode): Promise<any> {
    try {
      let query = `CALL spGetCountryMasterData (?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
  async insUpdtCountryMaster(data: any): Promise<any> {
    try {
      
      let query = `CALL spInsUpdtCountryMaster (?,?,?,?,?,?,?,?,?,?,?)`;

      //return await this.conn.query(query);
      //  console.log(data);
      const res = await this.conn.query(query, [
        data.CompCode,
        data.InsUpdtType,
        data.CountryCode,	
        data.CountryName,	
        data.MobileCode,	
        data.CurrencySymbolChar,	
        data.CountryCode2Char,	
        data.CurrencyCode,	
        data.IsDefault,	
        data.IsActive,
        data.updt_usrId,  
      ]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
}
