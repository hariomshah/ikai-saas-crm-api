import { Controller, Logger, Post, Body, Get, Param } from "@nestjs/common";
import { RestaurantPosService } from "../restaurant-pos/restaurant-pos.service";
import { SelfOrderService } from "./self-order.service";
@Controller("self-order")
export class SelfOrderController {
  private logger = new Logger("SelfOrderController");
  constructor(
    private restaurantService: RestaurantPosService,
    private selfOrderService: SelfOrderService
  ) {}

  @Get("getPOSRestaurantMenuRates/:CompCode")
  getPOSRestaurantMenuRates( @Param("CompCode") CompCode: any): Promise<any> {
    return this.restaurantService.getPOSRestaurantMenuRates(CompCode);
  }

  @Get("getPOSRestaurantUserFavoriteMenus/:CompCode/:UserType/:UserId")
  getPOSRestaurantUserFavoriteMenus(
    @Param("CompCode") CompCode: any,
    @Param("UserType") UserType: any,
    @Param("UserId") UserId: any
  ): Promise<any> {
    return this.restaurantService.getPOSRestaurantUserFavoriteMenus(
      CompCode,
      UserType,
      UserId
    );
  }

  @Get("getPOSRestaurantMenuAddOnDtl/:CompCode")
  getPOSRestaurantMenuAddOnDtl(@Param("CompCode") CompCode: any): Promise<any> {
    return this.restaurantService.getPOSRestaurantMenuAddOnDtl(CompCode);
  }

  @Get("getPOSRestaurantMenuAddOns/:CompCode")
  getPOSRestaurantMenuAddOns(@Param("CompCode") CompCode: any): Promise<any> {
    return this.restaurantService.getPOSRestaurantMenuAddOns(CompCode);
  }

  @Get("getPOSRestaurantMenuVariationRates/:CompCode")
  getPOSRestaurantMenuVariationRates(@Param("CompCode") CompCode: any): Promise<any> {
    return this.restaurantService.getPOSRestaurantMenuVariationRates(CompCode);
  }

  @Post("saveKOT")
  saveKOT(@Body("data") data: any): Promise<any> {
    return this.restaurantService.saveKOT(data);
  }

  @Post("saveTableStatus")
  saveTableStatus(@Body("data") data: any): Promise<any> {
    return this.restaurantService.saveTableStatus(data);
  }

  @Post("GetConfig")
  getConfig(@Body("CompCode") CompCode: any): Promise<any> {
    return this.selfOrderService.getConfig(CompCode);
  }

  @Post("fetchValidateSelfOrder")
  fetchValidateSelfOrder(@Body("data") data: any): Promise<any> {
    return this.selfOrderService.fetchValidateSelfOrder(data);
  }
}
