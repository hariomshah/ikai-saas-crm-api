import { Controller, Logger, Get, Post, Body, Param } from "@nestjs/common";
import { ReceipeMasterService } from "./receipe-master.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("receipe-master")
export class ReceipeMasterController {
  private logger = new Logger("ReceipeMasterController");
  constructor(private receipemaster: ReceipeMasterService) {}

  @Get("GetReceipeHDR/:CompCode")
  getReceipeHDR(
    @Param("CompCode") CompCode: any
  ): // @Body('data') data:any
  Promise<any> {
    return this.receipemaster.getReceipeHDR(CompCode);
  }
  //spValidateMenuVariation
  @Get("getReceipeMenuVariationInfo/:CompCode/:MenuCode")
  getReceipeMenuVariationInfo(
    @Param("CompCode") CompCode: any,
    @Param("MenuCode") MenuCode: any
  ): Promise<any> {
    return this.receipemaster.getReceipeMenuVariationInfo(CompCode, MenuCode);
  }
  //spRestaurantGetRecipeConsumptionDtl
  @Get("getRestaurantGetRecipeConsumptionDtl/:CompCode/:BranchCode/:MenuCode")
  getRestaurantGetRecipeConsumptionDtl(
    @Param("CompCode") CompCode: any,
    @Param("BranchCode") BranchCode: any,
    @Param("MenuCode") MenuCode: any
  ): Promise<any> {
    return this.receipemaster.getRestaurantGetRecipeConsumptionDtl(
      CompCode,
      BranchCode,
      MenuCode
    );
  }

  @Get("GetReceipeDTL/:CompCode/:MenuCode")
  getReceipeDTL(
    @Param("CompCode") CompCode: any,
    @Param("MenuCode") MenuCode: any
  ): Promise<any> {
    return this.receipemaster.getReceipeDTL(CompCode,MenuCode);
  }

  @Post("InsUpdtReceipeMaster")
  InsUpdtReceipeMaster(@Body("data") data: any): Promise<any> {
    return this.receipemaster.InsUpdtReceipeMaster(data);
  }
  @Post("InsUpdtReceipesMaster")
  InsUpdtReceipesMaster(@Body("data") data: any): Promise<any> {
    return this.receipemaster.InsUpdtReceipesMaster(data);
  }

  @Post("InsUpdtReceipeManager")
  InsUpdtReceipeManager(@Body("data") data: any): Promise<any> {
    return this.receipemaster.InsUpdtReceipeManager(data);
  }

  @Post("DeleteReciepeMgmtDtl")
  DeleteReciepeMgmtDtl(@Body("data") data: any): Promise<any> {
    return this.receipemaster.DeleteReciepeMgmtDtl(data);
  }
}
