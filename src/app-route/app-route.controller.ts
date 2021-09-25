import { Controller, Logger, Post, Body, Get, Param } from "@nestjs/common";
import { AppRouteService } from "./app-route.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@Controller("app-route")
export class AppRouteController {
  private logger = new Logger("AppRouteController");

  constructor(private service: AppRouteService) {}

  //   getAppRouteHdr
  @Get("getAppRouteHdr/:CompCode")
  getAppRouteHdr(@Param("CompCode") CompCode: any): Promise<any> {
    console.log(CompCode,"CompCode")
    return this.service.getAppRouteHdr(CompCode);
  }

  //   getAppRouteDtl
  @Get("getAppRouteDtl/:CompCode/:RouteId")
  getAppRouteDtl(
    @Param("CompCode") CompCode: any,
    @Param("RouteId") RouteId: any
  ): Promise<any> {
    return this.service.getAppRouteDtl(CompCode, RouteId);
  }

  //   getFilterFieldTypeDefination
  @Get("getFilterFieldTypeDefination/:CompCode")
  getFilterFieldTypeDefination(@Param("CompCode") CompCode: any): Promise<any> {
    return this.service.getFilterFieldTypeDefination(CompCode);
  }

  @Post("insUpdtAppRoute")
  insUpdtAppRoute(@Body("data") data: any): Promise<any> {
    return this.service.insUpdtAppRoute(data);
  }
}
