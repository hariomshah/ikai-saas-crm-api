import { Controller, Logger, Get, Body, Post,Param } from "@nestjs/common";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";
import { MenuvariationsMasterService } from "./menuvariations-master.service";

@Controller("menuvariations-master")
export class MenuvariationsMasterController {
  private logger = new Logger("MenuvariationsMasterController ");
  constructor(private menuvariations: MenuvariationsMasterService) {}

  @Get("getMenuVariations/:CompCode")
  getMenuVariations(@Param("CompCode") CompCode : any): Promise<any> {
    return this.menuvariations.getMenuVariations(CompCode);
  }
}
