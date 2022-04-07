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

  // getDataLeadsActionStatus
  @Get("getDataLeadsActionStatus/:CompCode")
  getDataLeadsActionStatus(@Param("CompCode") CompCode: any): Promise<any> {
    return this.leads.getDataLeadsActionStatus(CompCode);
  }

  // getDataCRMLoanType

  @Get("getDataCRMLoanType/:CompCode")
  getDataCRMLoanType(@Param("CompCode") CompCode: any): Promise<any> {
    return this.leads.getDataCRMLoanType(CompCode);
  }

  // getDataLeadsPriority
  @Get("getDataLeadsPriority/:CompCode")
  getDataLeadsPriority(@Param("CompCode") CompCode: any): Promise<any> {
    return this.leads.getDataLeadsPriority(CompCode);
  }

  // getDataLeadsDetails
  @Get("getDataLeadsHistoryDetails/:CompCode/:LeadId")
  getDataLeadsHistoryDetails(
    @Param("CompCode") CompCode: any,
    @Param("LeadId") LeadId: any
  ): Promise<any> {
    return this.leads.getDataLeadsHistoryDetails(CompCode, LeadId);
  }

  // getLeadsDataCallerRM
  @Get("getLeadsDataCallerRM/:CompCode/:TranType/:TranUser")
  getLeadsDataCallerRM(
    @Param("CompCode") CompCode: any,
    @Param("TranType") TranType: any,
    @Param("TranUser") TranUser: any
  ): Promise<any> {
    return this.leads.getLeadsDataCallerRM(CompCode, TranType, TranUser);
  }

  // validateLeadId
  @Get("validateLeadId/:CompCode/:LeadId")
  validateLeadId(
    @Param("CompCode") CompCode: any,
    @Param("LeadId") LeadId: any
  ): Promise<any> {
    return this.leads.validateLeadId(CompCode, LeadId);
  }

  // getLeadsViewData;
  @Get("getLeadsViewData/:CompCode/:LeadId")
  getLeadsViewData(
    @Param("CompCode") CompCode: any,
    @Param("LeadId") LeadId: any
  ): Promise<any> {
    return this.leads.getLeadsViewData(CompCode, LeadId);
  }

  // getDataCRM_RMCallerDashboard;
  @Get("getDataCRM_RMCallerDashboard/:CompCode/:TranType/:FromDate/:ToDate")
  getDataCRM_RMCallerDashboard(
    @Param("CompCode") CompCode: any,
    @Param("TranType") LeadId: any,
    @Param("FromDate") FromDate: any,
    @Param("ToDate") ToDate: any
  ): Promise<any> {
    return this.leads.getDataCRM_RMCallerDashboard(
      CompCode,
      LeadId,
      FromDate,
      ToDate
    );
  }

  @Post("updtLeadsActionHdr")
  updtLeadsActionHdr(@Body("data") data: any): Promise<any> {
    return this.leads.updtLeadsActionHdr(data);
  }

  // getCRMEmployeePerformanceDashboard
  @Get("getCRMEmployeePerformanceDashboard/:CompCode")
  getCRMEmployeePerformanceDashboard(
    @Param("CompCode") CompCode: any
  ): Promise<any> {
    return this.leads.getCRMEmployeePerformanceDashboard(CompCode);
  }

  @Get("getDataCRMCallerRMPerformance/:CompCode/:FromDate/:ToDate")
  getDataCRMCallerRMPerformance(
    @Param("CompCode") CompCode: any,
    @Param("FromDate") FromDate: any,
    @Param("ToDate") ToDate: any
  ): Promise<any> {
    return this.leads.getDataCRMCallerRMPerformance(CompCode, FromDate, ToDate);
  }

  // getDataListOfLeads
  @Get("getDataListOfLeads/:CompCode")
  getDataListOfLeads(@Param("CompCode") CompCode: any): Promise<any> {
    return this.leads.getDataListOfLeads(CompCode);
  }

  @Get("getDataHighPrioritiesLeads/:CompCode")
  getDataHighPrioritiesLeads(@Param("CompCode") CompCode: any): Promise<any> {
    return this.leads.getDataHighPrioritiesLeads(CompCode);
  }
}
