import { Controller, Logger, Get, Body, Post, Param } from "@nestjs/common";
import { BranchmasterService } from "./branchmaster.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("branchmaster")
export class BranchmasterController {
  private logger = new Logger("BrandMasterController ");
  constructor(private branchmaster: BranchmasterService) {}

  //Brand Master
  @Get("getBranchMaster/:CompCode")
  getBranchMaster(@Param("CompCode") CompCode: any): Promise<any> {
    return this.branchmaster.getBranchMaster(CompCode);
  }

  @Post("InsUpdtBranchMaster")
  InsUpdtBranchMaster(@Body("data") data: any): Promise<any> {
    return this.branchmaster.InsUpdtBranchMaster(data);
  }
}
