import { Controller, Logger, Get, Body, Post,Param } from "@nestjs/common";
import { DeptmasterService } from "./deptmaster.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("deptmaster")
export class DeptmasterController {
  private logger = new Logger("BrandMasterController ");
  constructor(private deptmaster: DeptmasterService) {}

  //Brand Master
  @Get("getDeptMaster/:CompCode")
  getDeptMaster(@Param("CompCode") CompCode: any): Promise<any> {
    return this.deptmaster.getDeptMaster(CompCode);
  }

  @Post("InsUpdtDeptMaster")
  InsUpdtDeptMaster(@Body("data") data: any): Promise<any> {
    return this.deptmaster.InsUpdtDeptMaster(data);
  }
}
