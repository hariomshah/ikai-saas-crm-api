import { Controller, Logger, Post, Body, Get, Param } from "@nestjs/common";
import { TaxMasterService } from "./tax-master.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("tax-master")
export class TaxMasterController {
  private logger = new Logger("StateMasterController");

  constructor(private state: TaxMasterService) {}

  @Get("getTaxMaster/:CompCode")
  getTaxMaster(@Param("CompCode") CompCode: any): Promise<any> {
    return this.state.getTaxMaster(CompCode);
  }

  @Post("InsUpdtTaxMaster")
  InsUpdtTaxMaster(@Body("data") data: any): Promise<any> {
    return this.state.InsUpdtTaxMaster(data);
  }
}
