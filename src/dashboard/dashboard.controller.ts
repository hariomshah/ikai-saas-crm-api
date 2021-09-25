import { Controller, Logger, Post, Get, Body, Param } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("dashboard")
export class DashboardController {
  private logger = new Logger("DashboardController");
  constructor(private dashboard: DashboardService) {}

  @Get("getDashboardLayout/:CompCode")
  getDashboardLayout(@Param("CompCode") CompCode: any): Promise<any> {
    return this.dashboard.getDashboardLayout(CompCode);
  }

  @Get("getDashboardConfig/:CompCode")
  getDashboardConfig(@Param("CompCode") CompCode: any): Promise<any> {
    return this.dashboard.getDashboardConfig(CompCode);
  }

  @Get("getDashboardLayoutConfigMapp/:CompCode")
  getDashboardLayoutConfigMapp(@Param("CompCode") CompCode: any): Promise<any> {
    return this.dashboard.getDashboardLayoutConfigMapp(CompCode);
  }

  @Get("getComponentDataSourceQuery/:pQuery")
  getComponentDataSourceQuery(@Param("pQuery") pQuery: any): Promise<any> {
    // console.log(UserId)
    return this.dashboard.getComponentDataSourceQuery(pQuery);
  }

}
