import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";
import { async } from "rxjs/internal/scheduler/async";

@Injectable()
export class ServiceratemapService {
  private logger = new Logger("ServiceratemapService");

  constructor(private readonly conn: Connection) {}
  async insUpdtserviceratemapping(data: any): Promise<any> {
    const dataSource = data.Dtl;
    try {
      const Data = data.ServiceRateMap;
      let res=[]
      if (data.Hdr.isDeleted === false) {
        let query = `CALL spInsUpdtserviceratemapping (?,?,?,?,?,?,?,?,?)`;
        res = await this.conn.query(query, [
          data.Hdr.CompCode,
          data.Hdr.InsUpdtType,
          data.Hdr.ServiceID,
          data.Hdr.LocationId,
          data.Hdr.Rate,
          data.Hdr.updt_usr,
          data.Hdr.discType,
          data.Hdr.discValue,
          data.Hdr.PackageId,
        ]);
      }
      if (
        data.Hdr.FromDatabase === true &&
        data.Hdr.isDirty === true &&
        data.Hdr.isDeleted === true
      ) {
        let deleteQuery = `delete from serviceratemapping where ServiceID=${data.Hdr.ServiceID} 
        and  LocationId= ${data.Hdr.LocationId} and PackageId=${data.Hdr.PackageId}`;
        // console.log(deleteQuery,"hhh")

        const res = await this.conn.query(deleteQuery, []);
      }
      return { message: "successful", data: [{res:"success"}] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getserviceratemapping(CompCode): Promise<any> {
    try {
      let query = `CALL spGetserviceratemapping (?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async Getnewserviceratemapping(CompCode,ServiceID, LocationId): Promise<any> {
    try {
      let query = `CALL spGetnewserviceratemapping (?,?,?)`;
      const res = await this.conn.query(query, [CompCode,ServiceID, LocationId]);
      console.log(res,"dat")
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
}
 