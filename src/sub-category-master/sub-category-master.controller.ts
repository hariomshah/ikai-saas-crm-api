import { Controller, Logger, Post, Body, Get, Param } from "@nestjs/common";
import { SubCategoryMasterService } from "./sub-category-master.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@Controller("sub-category-master")
export class SubCategoryMasterController {
  private logger = new Logger("StateMasterController");

  constructor(private subcategorymaster: SubCategoryMasterService) {}
  @Get("getSubCategory/:CompCode")
  getSubCategory(@Param("CompCode") CompCode: any): Promise<any> {
    // console.log(UserId)
    return this.subcategorymaster.getSubCategory(CompCode);
  }

  @Post("InsUpdtSubCategoryMaster")
  InsUpdtSubCategoryMaster(@Body("data") data: any): Promise<any> {
    return this.subcategorymaster.InsUpdtSubCategoryMaster(data);
  }

  @Get("getSubCatMaster/:CompCode/:SubCatCode")
  getSubCatMaster(
    @Param("CompCode") CompCode: any,
    @Param("SubCatCode") SubCatCode: any
  ): Promise<any> {
    return this.subcategorymaster.getSubCatMaster(CompCode,SubCatCode);
  }
}
