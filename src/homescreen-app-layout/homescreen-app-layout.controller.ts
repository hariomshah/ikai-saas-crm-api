import { Controller, Logger, Post, Body, Get, Param } from "@nestjs/common";
import { HomescreenAppLayoutService } from "./homescreen-app-layout.service";

@Controller("homescreen-app-layout")
export class HomescreenAppLayoutController {
  private logger = new Logger("HomeScreenAppLayoutController");

  constructor(private service: HomescreenAppLayoutService) {}

  @Get("getHomeScreenAppLayout/:CompCode")
  getHomeScreenAppLayout(@Param("CompCode") CompCode: any): Promise<any> {
    return this.service.getHomeScreenAppLayout(CompCode);
  }

  @Get("getHomeScreenAppLayoutDtl/:CompCode")
  getHomeScreenAppLayoutDtl(@Param("CompCode") CompCode: any): Promise<any> {
    return this.service.getHomeScreenAppLayoutDtl(CompCode);
  }

  @Post("InsUpdtHomeScreenAppLayout")
  InsUpdtHomeScreenAppLayout(@Body("data") data: any): Promise<any> {
    return this.service.InsUpdtHomeScreenAppLayout(data);
  }

  @Post("InsUpdtHomeScreenAppLayoutDtl")
  InsUpdtHomeScreenAppLayoutDtl(@Body("data") data: any): Promise<any> {
    return this.service.InsUpdtHomeScreenAppLayoutDtl(data);
  }
}
