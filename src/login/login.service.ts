import {
  Injectable,
  InternalServerErrorException,
  Logger,
  HttpService,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPayloadCommon } from "../auth/jwt-payload.interface";

import { NotifyEventsService } from "../notify-events/notify-events.service";
import { Connection } from "typeorm";

@Injectable()
export class LoginService {
  private logger = new Logger("LoginService");

  constructor(
    private readonly conn: Connection,
    private readonly http: HttpService,
    private notifyEvents: NotifyEventsService,
    private jwtService: JwtService
  ) {}

  async generateOTP(userType: any, mobile: any): Promise<any> {
    try {
      let query = `CALL spGenerateOTP ( ${null},'${userType}','${mobile}')`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query);

      const dt = {
        UserType: userType,
        MobileNo: mobile,
      };
      this.notifyEvents.processEvents(null, "LOGINOTP", dt);

      // const res = await this.http.post("http://2factor.in/API/V1/a136bde1-dcf8-11e9-ade6-0200cd936042/SMS/" + mobile + "/" + data[0][0].optMessage + "/NursesAnywhereOTP").subscribe()
      // let api = data[0][0].api;
      // this.http
      //   .post(
      //     data[0][0].api
      //       .replace("<<MOBILENO>>", mobile)
      //       .replace("<<OTP>>", data[0][0].optMessage)
      //   )
      //   .subscribe((res) => {
      //     console.log(res.data);
      //   });
      // this.http.axiosRef.interceptors.request.use

      console.log({ message: "successful", data: data[0] });
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async validateOTP(
    CompCode: any,
    userType: any,
    mobile: any,
    otp: any
  ): Promise<any> {
    try {
      let query = `CALL spValidateOTP (?,?,?,?)`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query, [
        CompCode,
        userType,
        mobile,
        otp,
      ]);

      // console.log("res from validate otp", data[0][0].userId);
      const userId = data[0][0].userId;
      const payload: JwtPayloadCommon = { CompCode, userType, userId };
      // console.log(payload);
      const accessToken = await this.jwtService.sign(payload);

      // this.logger.debug(
      //   `Generated JWT token with payload ${JSON.stringify(payload)}`
      // );

      return {
        message: "successful",
        data: { accessToken: accessToken, userId: userId },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
  async validateCompCode(CompCode): Promise<any> {
    console.log(CompCode,"compcode");
    try {
      let query = `CALL spValidateCompCode(?)`;
      //return await this.conn.query(query);

      const data = await this.conn.query(query, [CompCode]).catch((er) => {
        throw er;
      });
      // console.log(data);
      if (data[0].length <= 0) {
        throw "Does not exist";
      }
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
