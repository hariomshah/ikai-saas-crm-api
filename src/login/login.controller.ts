import { Controller, Logger, Post, Body, Get, Param } from "@nestjs/common";
import { LoginService } from "./login.service";

@Controller("login")
export class LoginController {
  private logger = new Logger("LoginController");

  constructor(private service: LoginService) { }

  @Post("generateOTP")
  generateOTP(
    @Body("userType") userType: any,
    @Body("mobile") mobile: any
  ): Promise<any> {
    return this.service.generateOTP(userType, mobile);
  }

  @Post("validateOTP")
  validateOTP(
    @Body("CompCode") CompCode: any,
    @Body("userType") userType: any,
    @Body("mobile") mobile: any,
    @Body("otp") otp: any
  ): Promise<any> {
    return this.service.validateOTP(CompCode, userType, mobile, otp);
  }

  @Get("validateCompCode/:CompCode")
  validateCompCode(@Param("CompCode") CompCode: any): Promise<any> {
    console.log("controller",CompCode)
    return this.service.validateCompCode(CompCode);
  }
}
