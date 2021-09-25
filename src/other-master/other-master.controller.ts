import { Controller, Logger, Get, Body, Post, Param } from "@nestjs/common";
import { OtherMasterService } from "./other-master.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("other-master")
export class OtherMasterController {
  private logger = new Logger("OtherMasterController ");

  constructor(private othermaster: OtherMasterService) { }
  @Post("getOtherMaster")
  getOtherMaster(
    @Body("CompCode") CompCode: any,
    @Body("MasterType") MasterType: any
  ): Promise<any> {
    return this.othermaster.getOtherMaster(CompCode, MasterType);
  }

  @Get("getDesignations/:CompCode")
  getDesignations(@Param("CompCode") CompCode: any): Promise<any> {
    return this.othermaster.getOtherMaster(CompCode, "DSG");
  }

  @Get("getOrderStatus/:CompCode")
  getOrderStatus(@Param("CompCode") CompCode: any): Promise<any> {
    return this.othermaster.getOtherMaster(CompCode, "STS");
  }

  @Get("getSupportStatus/:CompCode")
  getSupportStatus(@Param("CompCode") CompCode: any): Promise<any> {
    return this.othermaster.getOtherMaster(CompCode, "HST");
  }

  @Get("getGrade/:CompCode")
  getGrade(@Param("CompCode") CompCode: any): Promise<any> {
    return this.othermaster.getOtherMaster(CompCode, "GRD");
  }
  @Get("getQualification/:CompCode")
  getQualification(@Param("CompCode") CompCode: any): Promise<any> {
    return this.othermaster.getOtherMaster(CompCode, "QLF");
  }
  @Get("getCategory/:CompCode")
  getCatagory(@Param("CompCode") CompCode: any): Promise<any> {
    return this.othermaster.getOtherMaster(CompCode, "CAT");
  }
  @Get("getExperience/:CompCode")
  getExperience(@Param("CompCode") CompCode: any): Promise<any> {
    return this.othermaster.getOtherMaster(CompCode, "EXP");
  }
  @Get("getSequence/:CompCode")
  getSequence(@Param("CompCode") CompCode: any): Promise<any> {
    return this.othermaster.getOtherMaster(CompCode, "SEQ");
  }
  @Get("getKotMasterStatus/:CompCode")
  getKotMasterStatus(@Param("CompCode") CompCode: any): Promise<any> {
    return this.othermaster.getOtherMaster(CompCode, "KOTSTS");
  }

  @Post("InsUpdtOtherMaster")
  insUpdtOtherMaster(@Body("data") data: any): Promise<any> {
    return this.othermaster.insUpdtOtherMaster(data);
  }

  @Get("getUserGroup/:CompCode")
  getUserGroup(@Param("CompCode") CompCode: any): Promise<any> {
    return this.othermaster.getOtherMaster(CompCode, "USRGRP");
  }

  @Get("getIncomeMaster/:CompCode")
  getIncomeMaster(@Param("CompCode") CompCode: any): Promise<any> {
    return this.othermaster.getOtherMaster(CompCode, "AINC");
  }
  @Get("getExpenseMaster/:CompCode")
  getExpenseMaster(@Param("CompCode") CompCode: any): Promise<any> {
    return this.othermaster.getOtherMaster(CompCode, "AEXP");
  }
  @Get("getSupplierType/:CompCode")
  getSupplierType(@Param("CompCode") CompCode: any): Promise<any> {
    return this.othermaster.getOtherMaster(CompCode, "SUPPTYP");
  }

  @Get("getReasonsMaster/:CompCode")
  getReasonsMaster(@Param("CompCode") CompCode: any): Promise<any> {
    return this.othermaster.getOtherMaster(CompCode, "RSM");
  }

  @Get("getDeliveryStatus/:CompCode")
  getDeliveryStatus(@Param("CompCode") CompCode: any): Promise<any> {
    return this.othermaster.getOtherMaster(CompCode, "DLRYSTS");
  }
}
