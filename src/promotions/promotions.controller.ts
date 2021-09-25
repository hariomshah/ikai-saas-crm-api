import { Controller, Logger, Post, Get, Body, Param } from "@nestjs/common";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";
import { PromotionsService } from "./promotions.service";

// @UseGuards(AuthGuard())
@Controller("promotions")
export class PromotionsController {
  private logger = new Logger("PromotionController");

  constructor(private promotion: PromotionsService) {}

  @Get("getPromotion/:CompCode")
  getPromotion(@Param("CompCode") CompCode: any): Promise<any> {
    return this.promotion.getPromotion(CompCode);
  }

  @Post("InsUpdtPromotions")
  InsUpdtPromotions(@Body("data") data: any): Promise<any> {
    return this.promotion.InsUpdtPromotions(data);
  }

  @Get("getPromotionIEData/:CompCode")
  getPromotionIEData(@Param("CompCode") CompCode: any): Promise<any> {
    return this.promotion.getPromotionIEData(CompCode);
  }

  @Get("getSelectQuery/:CompCode/:pQuery")
  getSelectQuery(
    @Param("CompCode") CompCode: any,
    @Param("pQuery") pQuery: any
  ): Promise<any> {
    // console.log(UserId)
    return this.promotion.getSelectQuery(CompCode,pQuery);
  }

  // @Post("InsUpdtPromotionsIEConfig")
  // InsUpdtPromotionsIEConfig(@Body("data") data: any): Promise<any> {
  //   return this.promotion.InsUpdtPromotionsIEConfig(data);
  // }

  @Get("getPromotionIEConfig/:pCompCode/:pBranchCode/:pPromoCode")
  getPromotionIEConfig(
    @Param("pCompCode") pCompCode: any,
    @Param("pBranchCode") pBranchCode: any,
    @Param("pPromoCode") pPromoCode: any
  ): Promise<any> {
    return this.promotion.getPromotionIEConfig(
      pCompCode,
      pBranchCode,
      pPromoCode
    );
  }

  @Get("getPromotionSchedule/:pCompCode/:pBranchCode/:pPromoCode")
  getPromotionSchedule(
    @Param("pCompCode") pCompCode: any,
    @Param("pBranchCode") pBranchCode: any,
    @Param("pPromoCode") pPromoCode: any
  ): Promise<any> {
    return this.promotion.getPromotionSchedule(
      pCompCode,
      pBranchCode,
      pPromoCode
    );
  }
}
