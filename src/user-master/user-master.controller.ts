import { Controller, Logger, Post, Get, Body, Param } from "@nestjs/common";
import { UserMasterService } from "./user-master.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@Controller("user-master")
export class UserMasterController {
  private logger = new Logger("UserMasterController");

  constructor(private usermaster: UserMasterService) {}
  @UseGuards(AuthGuard())
  @Post("insUpdtUserMaster")
  insHelpTran(@Body("data") data: any): Promise<any> {
    return this.usermaster.insUpdtUserMaster(data);
  }

  @UseGuards(AuthGuard())
  @Post("getUserMaster")
  getUserMaster(
    @Body("CompCode") CompCode: any,
    @Body("UserType") UserType: any
  ): Promise<any> {
    return this.usermaster.getUserMaster(CompCode, UserType);
  }

  @UseGuards(AuthGuard())
  @Get("getUserAccess/:CompCode/:UserId")
  getUserAccess(
    @Param("CompCode") CompCode: any,
    @Param("UserId") UserId: any
  ): Promise<any> {
    return this.usermaster.getUserAccess(CompCode, UserId);
  }

  @UseGuards(AuthGuard())
  @Post("insUpdtUserAccess")
  insUpdtUserAccess(@Body("data") data: any): Promise<any> {
    return this.usermaster.insUpdtUserAccess(data);
  }

  @UseGuards(AuthGuard())
  @Get("getUserRightmapp/:CompCode/:UserId")
  getUserRightmapp(
    @Param("CompCode") CompCode: any,
    @Param("UserId") UserId: any
  ): Promise<any> {
    return this.usermaster.getUserRightmapp(CompCode,UserId);
  }

  //Atul 20200616
  @UseGuards(AuthGuard())
  @Get("getUserAddress/:CompCode/:UserType/:UserId")
  getUserAddress(
    @Param("CompCode") CompCode: any,
    @Param("UserType") UserType: any,
    @Param("UserId") UserId: any
  ): Promise<any> {
    return this.usermaster.getUserAddress(CompCode,UserType, UserId);
  }

  @UseGuards(AuthGuard())
  @Post("insUpdtCustomerAddress")
  insUpdtCustomerAddress(@Body("data") data: any): Promise<any> {
    return this.usermaster.insUpdtCustomerAddress(data);
  }

  @Get("getUserHash/:CompCode/:Username")
  getUserHash(
    @Param("CompCode") CompCode: any,
    @Param("Username") username: any
  ): Promise<any> {
    return this.usermaster.getUserHash(CompCode,username);
  }

  @UseGuards(AuthGuard())
  @Get("getUserByMobile/:CompCode/:UserType/:Mobile")
  getUserByMobile(
    @Param("CompCode") CompCode: any,
    @Param("UserType") UserType: any,
    @Param("Mobile") Mobile: any
  ): Promise<any> {
    return this.usermaster.getUserByMobile(CompCode,UserType, Mobile);
  }

  @UseGuards(AuthGuard())
  @Post("InsUpdtPOSUserMaster")
  InsUpdtPOSUserMaster(@Body("data") data: any): Promise<any> {
    return this.usermaster.InsUpdtPOSUserMaster(data);
  }

  @UseGuards(AuthGuard())
  @Get("getUserDetail/:CompCode/:UserType/:UserId")
  getUserDetail(
    @Param("CompCode") CompCode: any,
    @Param("UserType") UserType: any,
    @Param("UserId") UserId: any
  ): Promise<any> {
    return this.usermaster.getUserDetail(CompCode,UserType, UserId);
  }

  @UseGuards(AuthGuard())
  @Get("getDataCustomers/:CompCode")
  getDataCustomers( @Param("CompCode") CompCode: any): Promise<any> {
    return this.usermaster.getDataCustomers(CompCode);
  }
}
