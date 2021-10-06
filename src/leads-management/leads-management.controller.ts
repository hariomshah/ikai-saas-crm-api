import { Controller, Logger, Post, Get, Body, Param } from "@nestjs/common";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";
import { LeadsManagementService } from "./leads-management.service";

@UseGuards(AuthGuard())
@Controller("leads-management")
export class LeadsManagementController {
  private logger = new Logger("LeadsManagementController");
  constructor(private leads: LeadsManagementService) {}

  @Get("getLeadsMaster/:CompCode")
  getLeadsMaster(@Param("CompCode") CompCode: any): Promise<any> {
    return this.leads.getLeadsMaster(CompCode);
  }

  @Post("insUpdtLeadsMaster")
  insUpdtLeadsMaster(@Body("data") data: any): Promise<any> {
    return this.leads.insUpdtLeadsMaster(data);
  }

  // getDataLeadsDashboard
  @Get("getDataLeadsDashboard/:CompCode")
  getDataLeadsDashboard(@Param("CompCode") CompCode: any): Promise<any> {
    return this.leads.getDataLeadsDashboard(CompCode);
  }

  // spGetDataListOfRMsAndCaller
  @Get("getDataListOfRMsAndCaller/:CompCode")
  getDataListOfRMsAndCaller(@Param("CompCode") CompCode: any): Promise<any> {
    return this.leads.getDataListOfRMsAndCaller(CompCode);
  }

  // insUpdtLeadAssignAndTransfer
  @Post("insUpdtLeadAssignAndTransfer")
  insUpdtLeadAssignAndTransfer(@Body("data") data: any): Promise<any> {
    return this.leads.insUpdtLeadAssignAndTransfer(data);
  }

  // getDataAssign_and_Transfer_Leads
  @Get("getDataAssign_and_Transfer_Leads/:CompCode/:TranType/:TranMode")
  getDataAssign_and_Transfer_Leads(
    @Param("CompCode") CompCode: any,
    @Param("TranType") TranType: any,
    @Param("TranMode") TranMode: any
  ): Promise<any> {
    return this.leads.getDataAssign_and_Transfer_Leads(
      CompCode,
      TranType,
      TranMode
    );
  }
}
