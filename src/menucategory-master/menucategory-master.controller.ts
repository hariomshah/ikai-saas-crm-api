import { Controller, Logger, Get, Body, Post, Param } from "@nestjs/common";
import { MenucategoryMasterService } from "./menucategory-master.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";


@UseGuards(AuthGuard())
@Controller("menucategory-master")
export class MenucategoryMasterController {
  private logger = new Logger("MenucategoryMasterController ");
  constructor(private menucategorymaster: MenucategoryMasterService) {}

  @Get("getMenuCategoryMaster/:CompCode")
  getMenuCategoryMaster(@Param("CompCode") CompCode : any): Promise<any> {
    return this.menucategorymaster.getMenuCategoryMaster(CompCode);
  }

  @Post("InsUpdtMenuCategoryMaster")
  InsUpdtMenuCategoryMaster(@Body("data") data: any): Promise<any> {
    return this.menucategorymaster.InsUpdtMenuCategoryMaster(data);
  }



}
