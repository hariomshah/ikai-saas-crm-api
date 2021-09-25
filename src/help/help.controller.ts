import {
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Body,
  Query,
} from "@nestjs/common";
import { User } from "../auth/user.entity";
import { GetUser } from "../auth/get-user.decorator";
import { HelpService } from "./help.service";

import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@Controller("help")
export class HelpController {
  private logger = new Logger("HelpController");

  constructor(private service: HelpService) {}

  // @UseGuards(AuthGuard())
  // @Get("getFAQData/:userType/:name")
  // getFAQData(
  //     @Param('userType') userType:string,
  //     @Param('name') name:string,
  //     @GetUser() user: User,
  // ): Promise<any> {
  //     return this.service.getFAQData(userType);
  // }
  @UseGuards(AuthGuard())
  @Post("getFAQData")
  getFAQData(
    @Body("CompCode") CompCode: any,
    @Body("userType") userType: any
  ): Promise<any> {
    return this.service.getFAQData(CompCode, userType);
  }

  @UseGuards(AuthGuard())
  @Post("getHelpCenterData")
  getHelpCenterData(
    @Body("CompCode") CompCode: any,
    @Body("userType") userType: any
  ): Promise<any> {
    return this.service.getHelpCenterData(CompCode, userType);
  }

  @Post("insHelpTran")
  insHelpTran(@Body("data") data: any): Promise<any> {
    return this.service.insHelpTran(data);
  }

  @UseGuards(AuthGuard())
  @Post("getPendingSupportTickets")
  getPendingSupportTickets(@Body("CompCode") CompCode: any): Promise<any> {
    return this.service.getPendingSupportTickets(CompCode);
  }

  @UseGuards(AuthGuard())
  @Post("getSupportTickets")
  getSupportTickets(
    @Body("CompCode") CompCode: any,
    @Body("FromDate") FromDate: any,
    @Body("ToDate") ToDate: any
  ): Promise<any> {
    return this.service.getSupportTickets(CompCode, FromDate, ToDate);
  }

  @UseGuards(AuthGuard())
  @Post("updtSupportTicket")
  updtSupportTicket(
    @Body("CompCode") CompCode: any,
    @Body("StatusCode") StatusCode: any,
    @Body("Remark") Remark: any,
    @Body("TicketNo") TicketNo: any,
    @Body("UpdtUsrId") UpdtUsrId: any
  ): Promise<any> {
    //   console.log(TicketNo)
    return this.service.updtSupportTicket(
      CompCode,
      StatusCode,
      Remark,
      TicketNo,
      UpdtUsrId
    );
  }

  @Post("GetHelpMasterPortal")
  getHelpMasterPortal(
    @Body("CompCode") CompCode: any
  ): // @Body('data') data:any
  Promise<any> {
    return this.service.getHelpMasterPortal(CompCode);
  }

  @Post("GetFAQMasterPortal")
  getFAQMasterPortal(
    @Body("CompCode") CompCode: any
  ): // @Body('data') data:any
  Promise<any> {
    return this.service.getFAQMasterPortal(CompCode);
  }

  @UseGuards(AuthGuard())
  @Post("insUpdtHelpCenter")
  insUpdtHelpCenter(@Body("data") data: any): Promise<any> {
    return this.service.insUpdtHelpCenter(data);
  }

  @UseGuards(AuthGuard())
  @Post("insUpdtFAQCenter")
  insUpdtFAQCenter(@Body("data") data: any): Promise<any> {
    return this.service.insUpdtFAQCenter(data);
  }

  @UseGuards(AuthGuard())
  @Get("getFAQGrpUsrmapp/:CompCode/:GroupCode/:UserType")
  getFAQGrpUsrmapp(
    @Param("CompCode") CompCode: any,
    @Param("GroupCode") GroupCode: any,
    @Param("UserType") UserType: any
  ): Promise<any> {
    return this.service.getFAQGrpUsrmapp(CompCode,GroupCode, UserType);
  }

  @UseGuards(AuthGuard())
  @Get("getHelpGrpUsrmapp/:CompCode/:GroupCode/:UserType")
  getHelpGrpUsrmapp(
    @Param("CompCode") CompCode: any,
    @Param("GroupCode") GroupCode: any,
    @Param("UserType") UserType: any
  ): Promise<any> {
    return this.service.getHelpGrpUsrmapp(CompCode,GroupCode, UserType);
  }

  @UseGuards(AuthGuard())
  @Post("insUpdtFaqGrpUsrmapp")
  insUpdtFaqGrpUsrmapp(@Body("data") data: any): Promise<any> {
    return this.service.insUpdtFaqGrpUsrmapp(data);
  }

  @UseGuards(AuthGuard())
  @Post("insUpdtHelpGrpUsrmapp")
  insUpdtHelpGrpUsrmapp(@Body("data") data: any): Promise<any> {
    return this.service.insUpdtHelpGrpUsrmapp(data);
  }
}
