import { Controller, Logger, Post, Body, Get, Param } from "@nestjs/common";
import { MenuMasterService } from "./menu-master.service";

import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("menu-master")
export class MenuMasterController {
  private logger = new Logger('MenuMaster');

  constructor(private state: MenuMasterService) { }

  @Get("getMenuMaster/:CompCode")
  getMenuMaster(@Param("CompCode") CompCode: any): Promise<any> {
    // console.log(UserId)
    return this.state.getMenuMaster(CompCode);
  }


  @Post('InsUpdtMenuMst')
  InsUpdtMenuMst(
    @Body('data') data: any
  ): Promise<any> {
    return this.state.InsUpdtMenuMst(data);
  }


  @Get("getMenuAddonHdr/:CompCode")
  getMenuAddonHdr(@Param("CompCode") CompCode: any): Promise<any> {
    return this.state.getMenuAddonHdr(CompCode);
  }

  @Get("getMenuAddonDtl/:CompCode")
  getMenuAddonDtl(@Param("CompCode") CompCode: any): Promise<any> {
    return this.state.getMenuAddonDtl(CompCode);
  }

  @Post("InsUpdtMenuAddonHdr")
  InsUpdtMenuAddonHdr(@Body("data") data: any): Promise<any> {
    return this.state.InsUpdtMenuAddonHdr(data);
  }

  @Post("InsUpdtMenuAddonDtl")
  InsUpdtMenuAddonDtl(@Body("data") data: any): Promise<any> {
    return this.state.InsUpdtMenuAddonDtl(data);
  }

  @Get("getMenuMasterCard/:CompCode/:MenuCode")
  getMenuMasterCard(
    @Param("CompCode") CompCode: any,
    @Param('MenuCode') MenuCode: any
  ): Promise<any> {
    return this.state.getMenuMasterCard(CompCode,MenuCode);
  }

  @Get("getHelpMenuCategory/:CompCode")
  getHelpMenuCategory(@Param("CompCode") CompCode: any): Promise<any> {
    return this.state.getHelpMenuCategory(CompCode);
  }

  @Get("getMenuImages/:CompCode/:ItemCode")
  getMenuImages(
    @Param("CompCode") CompCode: any,
    @Param('ItemCode') ItemCode: any
  ): Promise<any> {
    return this.state.getMenuImages(CompCode,ItemCode);
  }
  @Get("getMenuRateMapp/:CompCode/:BranchCode/:DeptCode/:SecCode")
  getMenuRateMapp(
    @Param("CompCode") CompCode: any,
    @Param("BranchCode") BranchCode: any,
    @Param("DeptCode") DeptCode: any,
    @Param("SecCode") SecCode: any
  ): Promise<any> {
    return this.state.getMenuRateMapp(CompCode,BranchCode, DeptCode, SecCode);
  }

  
  @Post("insUpdtMenuRateMapp")
  insUpdtMenuRateMapp(@Body("data") data: any,): Promise<any> {
    return this.state.insUpdtMenuRateMapp(data);
  }
  @Get("getMenuVariationTab/:CompCode/:MenuCode")
  getMenuVariationTab(
    @Param("CompCode") CompCode: any,
    @Param('MenuCode') MenuCode: any
  ): Promise<any> {
    return this.state.getMenuVariationTab(CompCode,MenuCode);
  }
  @Get("getMenuAddOnTab/:CompCode/:MenuCode")
  getMenuAddOnTab(
    @Param("CompCode") CompCode: any,
    @Param('MenuCode') MenuCode: any
  ): Promise<any> {
    return this.state.getMenuAddOnTab(CompCode,MenuCode);
  }

}
