import { Controller, Logger, Get, Body, Post, Param } from "@nestjs/common";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";
import { UnitmasterService } from "./unitmaster.service";

@UseGuards(AuthGuard())
@Controller("unitmaster")
export class UnitmasterController {
  private logger = new Logger("UnitMasterController ");
  constructor(private unitmaster: UnitmasterService) {}

  //Unit Master
  @Get("getUnitMaster/:CompCode")
  getUnitMaster(@Param("CompCode") CompCode: any): Promise<any> {
    return this.unitmaster.getUnitMaster(CompCode);
  }

  @Post("InsUpdtUnitMaster")
  InsUpdtUnitMaster(@Body("data") data: any): Promise<any> {
    return this.unitmaster.InsUpdtUnitMaster(data);
  }
}
