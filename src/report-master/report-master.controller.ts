import { Controller, Logger, Post, Get, Body, Param } from "@nestjs/common";
import { ReportMasterService } from "./report-master.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";
import * as config from "config";

const appConfig = config.get("appConfig");

@UseGuards(AuthGuard())
@Controller("report-master")
export class ReportMasterController {
  private logger = new Logger("ReportMasterService");

  constructor(private state: ReportMasterService) {}

  @Get("getReportDetails/:CompCode/:ReportId")
  getReportDetails(
    @Param("CompCode") CompCode: any,
    @Param("ReportId") ReportId: any
  ): Promise<any> {
    // console.log(UserId)
    return this.state.getReportDetails(CompCode, ReportId);
  }

  @Post("getReportDetailsData")
  getReportDetailsData(@Body("data") data: any): Promise<any> {
    // console.log(UserId)
    return this.state.getReportDetailsData(data);
  }

  @Get("getParamSelectQuery/:pQuery")
  getParamSelectQuery(
    @Param("pQuery") pQuery: any
  ): Promise<any> {
    // console.log(UserId)
    return this.state.getParamSelectQuery(pQuery);
  }

  @Get("getReportHdrDtl/:CompCode")
  getReportHdrDtl(@Param("CompCode") CompCode: any): Promise<any> {
    // console.log(UserId)z
    return this.state.getReportHdrDtl(CompCode);
  }

  @Get("getSysReportPrintHdr/:CompCode")
  getSysReportHdr(@Param("CompCode") CompCode: any): Promise<any> {
    // console.log(UserId)z
    return this.state.getSysReportPrintHdr(CompCode);
  }

  @Get("getSysReportChartHdr/:CompCode")
  getSysReportChartHdr(@Param("CompCode") CompCode: any): Promise<any> {
    // console.log(UserId)z
    return this.state.getSysReportChartHdr(CompCode);
  }

  @Post("updtSystemReportConfigs")
  updtSystemReportConfigs(@Body("data") data: any): Promise<any> {
    // console.log(UserId)
    return this.state.updtSystemReportConfigs(data);
  }
}
