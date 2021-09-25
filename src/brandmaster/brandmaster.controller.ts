import { Controller, Logger, Get, Body, Post, Param } from "@nestjs/common";
import { BrandmasterService } from "./brandmaster.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("brandmaster")
export class BrandmasterController {
  private logger = new Logger("BrandMasterController ");
  constructor(private brandmaster: BrandmasterService) {}

  //Brand Master
  @Get("getBrandMaster/:CompCode")
  getBrandMaster(@Param("CompCode") CompCode: any): Promise<any> {
    return this.brandmaster.getBrandMaster(CompCode);
  }

  @Post("InsUpdtBrandMaster")
  InsUpdtBrandMaster(@Body("data") data: any): Promise<any> {
    return this.brandmaster.InsUpdtBrandMaster(data);
  }

  @Get("getBrandData/:CompCode/:BrandCode")
  getBrandData(
    @Param("CompCode") CompCode: any,
    @Param("BrandCode") BrandCode: any
  ): Promise<any> {
    return this.brandmaster.getBrandData(CompCode, BrandCode);
  }
}
