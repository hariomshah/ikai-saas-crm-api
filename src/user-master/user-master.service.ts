import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
  Logger,
  HttpStatus,
  ArgumentsHost,
} from "@nestjs/common";
import { Connection } from "typeorm";
import { Response } from "express";
import { isUndefined } from "util";

@Injectable()
export class UserMasterService {
  private logger = new Logger("userMasterService");

  constructor(private readonly conn: Connection) {}

  async insUpdtUserMaster(data: any): Promise<any> {
    try {
      let query = `CALL spInsUpdtUserMaster (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      // console.log(data)
      //return await this.conn.query(query);
      const res = await this.conn.query(query, [
        data.CompCode,
        data.InsUpdtType,
        data.UserType,
        data.UserId,
        data.UserTypeRef,
        data.UserName,
        data.gender,
        data.email,
        data.mobile,
        data.password,
        data.RegisterFrom,
        data.UpdtUsr,
        data.hasDemographyInfo,
        data.Name,
        // data.Add1,
        // data.Add2,
        // data.Add3,
        data.GstNo,
        data.DOBmmdd,
        data.DOByyyy,
        data.AnniversaryMMDD,
        data.AnniversaryYYYY,
        data.User_Group,
        data.IsActive,
        data.Show_Cashier_Alert,
        data.Show_Kitchen_Alert,
        data.Show_Admin_Alert,
        data.Show_Waiter_Alert,
        data.defaultUserPath,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      if (error.sqlState === "45001") {
        throw new UnprocessableEntityException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async insUpdtUserAccess(data: any): Promise<any> {
    try {
      let Id = 0;
      let query = `CALL spInsUpdtUserRightsMappHdr (?,?,?,?,?,?)`;

      const rslt = await this.conn
        .query(query, [
          data.header.CompCode,
          data.header.UserType,
          data.header.UserId,
          data.header.UserAccessType,
          data.header.UserGroupAccessId,
          data.header.UpdtUsrId,
        ])
        .then((res) => {
          Id = res[0][0].Id;
          data.details.map((item) => {
            item.Rights.split(",").map((right) => {
              let kk = right.split("#");
              const res1 = this.conn.query(
                "CALL spInsUpdtUserRightsMappDtl (?,?,?,?,?,?)",
                [
                  data.header.CompCode,
                  Id,
                  item.ModuleId,
                  kk[1],
                  kk[0],
                  data.header.UpdtUsrId,
                ]
              );
            });
          });
        });

      return {
        message: "successful",
        data: Id,
      };
    } catch (error) {
      this.logger.error(error);
      if (error.sqlState === "45001") {
        throw new UnprocessableEntityException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  // async getUserMaster(): Promise<any> {
  //   try {
  //     let query = `CALL spGetUserMasters`;
  //     const res = await this.conn.query(query, [
  //       data.UserType
  //     ]);
  //     return { message: 'successful', data: res[0] };
  //   } catch (error) {
  //     this.logger.error(error);

  //     throw new InternalServerErrorException();
  //   }
  // }

  async getUserMaster(CompCode, UserType): Promise<any> {
    try {
      let query = `CALL spGetUserMaster (?,?)`;
      const res = await this.conn.query(query, [CompCode, UserType]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getUserAccess(CompCode, UserId): Promise<any> {
    try {
      let query = `CALL spGetUserAccess (?,?)`;
      // console.log(UserId = "undefined" ? 0 : UserId);
      const res = await this.conn.query(query, [CompCode, UserId]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getUserRightmapp(CompCode, UserId): Promise<any> {
    try {
      let query = `CALL spGetUserRightsMapp (?,?)`;
      const res = await this.conn.query(query, [CompCode, UserId]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //Atul 20200616
  async getUserAddress(CompCode, UserType, UserId): Promise<any> {
    try {
      let query = `CALL spGetDataUserAddress (?,?,?)`;
      const res = await this.conn.query(query, [CompCode, UserType, UserId]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async insUpdtCustomerAddress(data: any): Promise<any> {
    // console.log(data);
    try {
      let query = `CALL spInsUpdtUserAddresses (?,?,?,?,?,?,?,?,?,?,?,?,?)`;

      const res = await this.conn.query(query, [
        data.CompCode,
        data.AddressId,
        data.UserType,
        data.UserId,
        data.add1,
        data.add2,
        data.add3,
        data.AddressTag,
        data.City,
        data.PinCode,
        data.IsDefault,
        data.MarkDeleted,
        data.updt_usrId,
      ]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getUserHash(CompCode, username): Promise<any> {
    try {
      let query = `CALL spGetUserHashDetail (?,?)`;
      // console.log(UserId = "undefined" ? 0 : UserId);
      const res = await this.conn.query(query, [CompCode, username]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getUserByMobile(CompCode, UserType, Mobile): Promise<any> {
    try {
      let query = `CALL spGetUserByMobile (?,?,?)`;
      const res = await this.conn.query(query, [CompCode, UserType, Mobile]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async InsUpdtPOSUserMaster(data: any): Promise<any> {
    try {
      let query = `CALL spInsUpdtPOSUserMaster (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      //return await this.conn.query(query);
      const res = await this.conn.query(query, [
        data.CompCode,
        data.UserType,
        data.UserId,
        data.gender,
        data.email,
        data.mobile,
        data.UpdtUsr,
        data.hasDemographyInfo,
        data.Name,
        data.DOBmmdd,
        data.DOByyyy,
        data.AnniversaryMMDD,
        data.AnniversaryYYYY,
        data.GstNo,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      if (error.sqlState === "45001") {
        throw new UnprocessableEntityException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getUserDetail(CompCode, UserType, UserId): Promise<any> {
    try {
      let query = `CALL spGetUserDetail (?,?,?)`;
      const res = await this.conn.query(query, [CompCode, UserType, UserId]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getDataCustomers(CompCode): Promise<any> {
    try {
      let query = `CALL spGetDataCustomers (?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
