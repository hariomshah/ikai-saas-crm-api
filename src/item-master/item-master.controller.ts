import { Controller, Logger, Post, Body, Get, Param } from "@nestjs/common";
import { ItemMasterService } from "./item-master.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@Controller("item-master")
export class ItemMasterController {
  private logger = new Logger("StateMasterController");

  constructor(private state: ItemMasterService) { }

  @Get("getItemMaster/:CompCode")
  getItemMaster(@Param("CompCode") CompCode: any): Promise<any> {
    return this.state.getItemMaster(CompCode);
  }

  @Get("getHelpSubCategory/:CompCode")
  getHelpSubCategory(@Param("CompCode") CompCode: any): Promise<any> {
    return this.state.getHelpSubCategory(CompCode);
  }

  @Get("getItemBarcode/:CompCode/:itemCode")
  getItemBarcode(
    @Param("CompCode") CompCode: any,
    @Param("itemCode") itemCode: any
  ): Promise<any> {
    return this.state.getItemBarcode(CompCode, itemCode);
  }

  @Get("getItemImages/:CompCode/:ItemCode")
  getItemImages(
    @Param("CompCode") CompCode: any,
    @Param("ItemCode") ItemCode: any
  ): Promise<any> {
    return this.state.getItemImages(CompCode, ItemCode);
  }

  @Get("getItemMasterCard/:CompCode/:ItemCode")
  getItemMasterCard(
    @Param("CompCode") CompCode: any,
    @Param("ItemCode") ItemCode: any
  ): Promise<any> {
    return this.state.getItemMasterCard(CompCode, ItemCode);
  }

  @Post("InsUpdtItemMst")
  InsUpdtItemMst(@Body("data") data: any): Promise<any> {
    return this.state.InsUpdtItemMst(data);
  }

  @Get("getItemMasterData/:CompCode/:ItemCode")
  getItemMasterData(
    @Param("CompCode") CompCode: any,
    @Param("ItemCode") ItemCode: any
  ): Promise<any> {
    return this.state.getItemMasterData(CompCode, ItemCode);
  }

  @Get("getValidateItemBarcode/:CompCode/:Barcode/:ItemCode")
  getValidateItemBarcode(
    @Param("CompCode") CompCode: any,
    @Param("Barcode") Barcode: any,
    @Param("ItemCode") ItemCode: any
  ): Promise<any> {
    return this.state.getValidateItemBarcode(CompCode, Barcode, ItemCode);
  }
  @Get("getValidateItemMaster/:CompCode/:ItemCode")
  getValidateItemMaster(
    @Param("CompCode") CompCode: any,
    @Param("ItemCode") ItemCode: any
  ): Promise<any> {
    return this.state.getValidateItemMaster(CompCode, ItemCode);
  }

  //getDataItemAddInfoTemplate Atul 2021-01-29

  @Get("getDataItemAddInfoTemplate/:CompCode/:ItemCode/:TemplateId")
  getDataItemAddInfoTemplate(
    @Param("CompCode") CompCode: any,
    @Param("ItemCode") ItemCode: any,
    @Param("TemplateId") TemplateId: any
  ): Promise<any> {
    return this.state.getDataItemAddInfoTemplate(CompCode, ItemCode, TemplateId);
  }

  // saveInsItemMstAddInfoDtl
  @Post("saveItemMstAddInfoDtl")
  saveItemMstAddInfoDtl(@Body("data") data: any): Promise<any> {
    return this.state.saveItemMstAddInfoDtl(data);
  }


  @Get("getVariationTypesConfigHdr/:CompCode")
  getVariationTypesConfigHdr(
    @Param("CompCode") CompCode: any,
  ): Promise<any> {
    return this.state.getVariationTypesConfigHdr(CompCode);
  }

  //spGetItemVariationConfigData
  @Get("getItemVariationConfigData/:CompCode")
  getItemVariationConfigData(@Param("CompCode") CompCode: any): Promise<any> {
    return this.state.getItemVariationConfigData(CompCode);
  }

  @Get("getDataItemVariants/:CompCode/:ItemCode")
  getDataItemVariants(
    @Param("CompCode") CompCode: string,
    @Param("ItemCode") ItemCode: string
  ): Promise<any> {
    return this.state.getDataItemVariants(CompCode, ItemCode);
  }
}
