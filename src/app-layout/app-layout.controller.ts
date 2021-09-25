import { Controller, Logger, Post, Body, Get, Param } from "@nestjs/common";
import { AppLayoutService } from "./app-layout.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("app-layout")
export class AppLayoutController {
  private logger = new Logger("AppLayoutController");

  constructor(private service: AppLayoutService) {}

  @Get("getAppLayout/:CompCode/:DeviceType")
  getAppLayout(
    @Param("CompCode") CompCode: any,
    @Param("DeviceType") DeviceType: any
  ): Promise<any> {
    return this.service.getAppLayout(CompCode, DeviceType);
  }

  @Get("getAppLayoutDtl/:CompCode/:DeviceType")
  getAppLayoutDtl(
    @Param("CompCode") CompCode: any,
    @Param("DeviceType") DeviceType: any
  ): Promise<any> {
    return this.service.getAppLayoutDtl(CompCode, DeviceType);
  }

  @Post("InsUpdtAppLayout")
  InsUpdtAppLayout(@Body("data") data: any): Promise<any> {
    return this.service.InsUpdtAppLayout(data);
  }

  @Post("InsUpdtAppLayoutDtl")
  InsUpdtAppLayoutDtl(@Body("data") data: any): Promise<any> {
    return this.service.InsUpdtAppLayoutDtl(data);
  }

  @Get("getLayoutTypeConfigHdr/:CompCode")
  getLayoutTypeConfigHdr(@Param("CompCode") CompCode: any): Promise<any> {
    return this.service.getLayoutTypeConfigHdr(CompCode);
  }
  @Get("getLayoutTypeConfigDtl/:CompCode/:LayoutTypeCode")
  getLayoutTypeConfigDtl(
    @Param("CompCode") CompCode: any,
    @Param("LayoutTypeCode") LayoutTypeCode: any
  ): Promise<any> {
    return this.service.getLayoutTypeConfigDtl(CompCode, LayoutTypeCode);
  }

  @Post("deleteAppLayoutHdr")
  deleteAppLayoutHdr(@Body("data") data: any): Promise<any> {
    return this.service.deleteAppLayoutHdr(data);
  }

  @Post("deleteAppLayoutDtl")
  deleteAppLayoutDtl(@Body("data") data: any): Promise<any> {
    return this.service.deleteAppLayoutDtl(data);
  }
}
