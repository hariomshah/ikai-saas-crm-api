import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class ServiceService {
  private logger = new Logger("serviceService");

  constructor(private readonly conn: Connection) {}

  // async getServiceTypeMaster(): Promise<any> {
  //     try {
  //       let query = `CALL spGetServiceTypeMaster ()`;
  //       const res = await this.conn.query(query, [
  //       ]);
  //       return { message: 'successful', data: res[0] };
  //     } catch (error) {
  //       this.logger.error(error);

  //       throw new InternalServerErrorException();
  //     }
  //   }

  async getServiceMaster(CompCode): Promise<any> {
    try {
      let query = `CALL spGetServiceMaster (?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async Getnewserslotlocmapp(CompCode, LocationId, ServiceID): Promise<any> {
    try {
      // console.log(ServiceID,LocationId)
      let query = `CALL spGetDataSrvSlotLocMapp (?,?,?)`;
      const res = await this.conn.query(query, [
        CompCode,
        LocationId,
        ServiceID,
      ]);
      // console.log(res,"dat")
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async insUpdtServiceMaster(data: any): Promise<any> {
    try {
      let query = `CALL spInsUpdtServiceMaster (?,?,?,?,?,?,?,?,?,?,?,?)`;

      //return await this.conn.query(query);
      const res = await this.conn.query(query, [
        data.CompCode,
        data.InsUpdtType,
        data.ServiceId,
        data.ServiceType,
        data.ServiceTitle,
        data.ServiceDesc,
        data.ServiceUIImage,
        data.pathType === null ? "U": data.pathType,
        data.HSNSACCode,
        data.TaxCode,
        data.IsActive,
        data.updt_usr,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async insUpdtServiceTypeMaster(data: any): Promise<any> {
    try {
      let query = `CALL spInsUpdtServiceTypeMaster(?,?,?,?,?,?,?,?,?,?,?)`;
      // console.log(data);
      //return await this.conn.query(query);
      const res = await this.conn.query(query, [
        data.CompCode,
        data.InsUpdtType,
        data.ServiceTypeCode,
        data.ServiceTypeTitle,
        data.ServiceTypeDesc,
        data.ServiceTypeDescDetail,
        data.ServiceTypeImageURI,
        data.pathType === null ? "U" : data.pathType,
        data.IsActive,
        data.updt_usr,
        data.orderby,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
}
