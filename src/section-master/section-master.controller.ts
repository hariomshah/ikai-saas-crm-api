import { Controller, Logger, Get, Body, Post, Param } from '@nestjs/common';
import { SectionMasterService } from './section-master.service';
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@Controller('section-master')
export class SectionMasterController {
  private logger = new Logger("BrandMasterController ");
  constructor(private sectmaster: SectionMasterService) { }

  //Brand Master
  @Get("getSectionMaster/:CompCode")
  getSectionMaster(@Param("CompCode") CompCode: any): Promise<any> {
    return this.sectmaster.getSectionMaster(CompCode);
  }

  @Post("InsUpdtSectionMaster")
  InsUpdtSectionMaster(@Body("data") data: any): Promise<any> {
    return this.sectmaster.InsUpdtSectionMaster(data);
  }


  //Atul 04/08/2020
  @Get("getSectionMasterCardData/:CompCode/:SecCode")
  getSectionMasterCardData(@Param("CompCode") CompCode: any, @Param("SecCode") SecCode: any): Promise<any> {
    return this.sectmaster.getSectionMasterCardData(CompCode, SecCode);
  }
}

