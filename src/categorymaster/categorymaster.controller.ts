import { Controller, Logger, Get, Body, Post, Param } from "@nestjs/common";
import { CategorymasterService } from "./categorymaster.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("categorymaster")
export class CategorymasterController {
  private logger = new Logger("CategoryMasterController ");
  constructor(private categorymaster: CategorymasterService) {}

  //Category Master
  @Get("getCategoryMaster/:CompCode")
  getCategoryMaster(@Param("CompCode") CompCode: any): Promise<any> {
    // console.log(UserId)
    return this.categorymaster.getCategoryMaster(CompCode);
  }

  @Post("InsUpdtCategoryMaster")
  InsUpdtCategoryMaster(@Body("data") data: any): Promise<any> {
    return this.categorymaster.InsUpdtCategoryMaster(data);
  }

  @Get("getCatMaster/:CompCode/:CatCode")
  getCatMaster(
    @Param("CompCode") CompCode: any,
    @Param("CatCode") CatCode: any
  ): Promise<any> {
    return this.categorymaster.getCatMaster(CompCode, CatCode);
  }
}
