import { Controller, Logger, Get, Body, Post,Param } from "@nestjs/common";
import { ClassMasterService } from "./class-master.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("class-master")
export class ClassMasterController {
  private logger = new Logger("ClassMasterController ");
  constructor(private classmaster: ClassMasterService) {}

  @Get("getClassMaster/:CompCode")
  getClassMaster(@Param("CompCode") CompCode: any): Promise<any> {
    return this.classmaster.getClassMaster(CompCode);
  }

  @Post("InsUpdtClassMaster")
  InsUpdtClassMaster(@Body("data") data: any): Promise<any> {
    return this.classmaster.InsUpdtClassMaster(data);
  }
}
