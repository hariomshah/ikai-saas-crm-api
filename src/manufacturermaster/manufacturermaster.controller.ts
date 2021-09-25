import { Controller, Logger, Get, Body, Post, Param } from "@nestjs/common";
import { ManufacturermasterService } from "./manufacturermaster.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("manufacturermaster")
export class ManufacturermasterController {
  private logger = new Logger("ManufacturerMasterController ");
  constructor(private manufacturermaster: ManufacturermasterService) {}

  //Category Master
  @Get("getManufacturerMaster/:CompCode")
  getManufacturerMaster(@Param("CompCode") CompCode: any): Promise<any> {
    return this.manufacturermaster.getManufacturerMaster(CompCode);
  }

  @Post("InsUpdtManufacturerMaster")
  InsUpdtManufacturerMaster(@Body("data") data: any): Promise<any> {
    return this.manufacturermaster.InsUpdtManufacturerMaster(data);
  }

  @Get("getMFRData/:CompCode/:mfrCode")
  getMFRData(
    @Param("CompCode") CompCode: any,
    @Param("mfrCode") mfrCode: any
  ): Promise<any> {
    return this.manufacturermaster.getMFRData(CompCode,mfrCode);
  }
}
