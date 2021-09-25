import { Controller, Logger, Get, Body, Post, Param } from "@nestjs/common";
import { ItemAddInfoTemplateService } from "./item-add-info-template.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("item-add-info-template")
export class ItemAddInfoTemplateController {
  private logger = new Logger("ItemAddInfoTemplate");
  constructor(private service: ItemAddInfoTemplateService) {}

  @Get("getItemAddInfoTmplHdr/:CompCode")
  getItemAddInfoTmplHdr(@Param("CompCode") CompCode: any): Promise<any> {
    return this.service.getItemAddInfoTmplHdr(CompCode);
  }

  @Get("getItemAddInfoTmplDtl/:CompCode/:TempId")
  getItemAddInfoTmplDtl(
    @Param("CompCode") CompCode: any,
    @Param("TempId") TempId: any
  ): Promise<any> {
    return this.service.getItemAddInfoTmplDtl(CompCode, TempId);
  }

  // @Post("InsUpdtItemAddInfoTmplHdr")
  // InsUpdtItemAddInfoTmplHdr(@Body("data") data: any): Promise<any> {
  //   return this.service.InsUpdtItemAddInfoTmplHdr(data);
  // }

  @Post("InsUpdtItemAddInfoTmpl")
  InsUpdtItemAddInfoTmpl(@Body("data") data: any): Promise<any> {
    return this.service.InsUpdtItemAddInfoTmpl(data);
  }
}
