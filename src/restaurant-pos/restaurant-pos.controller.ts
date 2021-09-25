import { Controller, Logger, Post, Body, Get, Param } from "@nestjs/common";
import { RestaurantPosService } from "./restaurant-pos.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("restaurant-pos")
export class RestaurantPosController {
  private logger = new Logger("SlotController");
  constructor(private restaurantService: RestaurantPosService) {}

  @Get("getRestaurantTablesList/:CompCode/:BranchCode")
  getRestaurantTablesList(
    @Param("CompCode") CompCode: any,
    @Param("BranchCode") BranchCode: any
  ): Promise<any> {
    return this.restaurantService.getRestaurantTablesList(CompCode, BranchCode);
  }

  @Get("getPOSRestaurantMenuRates/:CompCode")
  getPOSRestaurantMenuRates(@Param("CompCode") CompCode: any): Promise<any> {
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
  getPOSRestaurantMenuVariationRates(
    @Param("CompCode") CompCode: any
  ): Promise<any> {
    return this.restaurantService.getPOSRestaurantMenuVariationRates(CompCode);
  }

  //getTableStatus
  @Get("getPOSRestaurantTableStatus/:CompCode")
  getTableStatus(@Param("CompCode") CompCode: any): Promise<any> {
    return this.restaurantService.getPOSRestaurantTableStatus(CompCode);
  }

  @Post("saveKOT")
  saveKOT(@Body("data") data: any): Promise<any> {
    // console.log(data)
    // return null;
    return this.restaurantService.saveKOT(data);
  }

  //apUpdtKOTAddInfo
  @Post("updateKOTAddInfo")
  updateKOTAddInfo(@Body("data") data: any): Promise<any> {
    return this.restaurantService.updateKOTAddInfo(data);
  }
  @Post("saveTableStatus")
  saveTableStatus(@Body("data") data: any): Promise<any> {
    return this.restaurantService.saveTableStatus(data);
  }

  //getTableInfoAndKOTs
  @Get("getTableInfoAndKOTs/:CompCode/:TableNo")
  getTableInfoAndKOTs(
    @Param("CompCode") CompCode: any,
    @Param("TableNo") TableNo: any
  ): Promise<any> {
    // console.log("getTableInfoAndKOTs", TableNo);
    return this.restaurantService.getTableInfoAndKOTs(CompCode, TableNo);
  }

  @Get("getPOSCaptain/:CompCode")
  getPOSCaptain(@Body("CompCode") CompCode: any): Promise<any> {
    // console.log('getTableInfoAndKOTs', )
    return this.restaurantService.getPOSCaptain(CompCode);
  }

  @Get(
    "GetPrepareInvoiceDataRestaurant/:CompCode/:BranchCode/:DepartmentCode/:KeyValue1/:KeyValue2/:KeyValue3/:KeyValue4/:KeyValue5"
  )
  GetPrepareInvoiceDataRestaurant(
    @Param("CompCode") CompCode: any,
    @Param("BranchCode") BranchCode: any,
    @Param("DepartmentCode") DepartmentCode: any,
    @Param("KeyValue1") KeyValue1: any,
    @Param("KeyValue2") KeyValue2: any,
    @Param("KeyValue3") KeyValue3: any,
    @Param("KeyValue4") KeyValue4: any,
    @Param("KeyValue5") KeyValue5: any
  ): Promise<any> {
    return this.restaurantService.GetPrepareInvoiceDataRestaurant(
      CompCode,
      BranchCode,
      DepartmentCode,
      KeyValue1,
      KeyValue2,
      KeyValue3,
      KeyValue4,
      KeyValue5
    );
  }

  @Post("updtPOSKOTInvoiceInfo")
  updtPOSKOTInvoiceInfo(@Body("data") data: any): Promise<any> {
    return this.restaurantService.updtPOSKOTInvoiceInfo(data);
  }
  @Get("getDataRestaurantPOSViewKOT/:CompCode/:BranchCode")
  getKOTViewData(
    @Param("CompCode") CompCode: any,
    @Param("BranchCode") BranchCode: any
  ): Promise<any> {
    // console.log('getTableInfoAndKOTs', )
    return this.restaurantService.getDataRestaurantPOSViewKOT(
      CompCode,
      BranchCode
    );
  }

  @Get("getDataRestaurantPOSViewKOTDtl/:CompCode/:KOTId")
  getKOTViewDtlData(
    @Param("CompCode") CompCode: any,
    @Param("KOTId") KOTId: any
  ): Promise<any> {
    return this.restaurantService.getDataRestaurantPOSViewKOTDtl(
      CompCode,
      KOTId
    );
  }

  @Get("getDataRestaurantPOSDeliveryPickupView/:CompCode/:BranchCode")
  getDataRestaurantPOSDeliveryPickupView(
    @Param("CompCode") CompCode: any,
    @Param("BranchCode") BranchCode: any
  ): Promise<any> {
    // console.log('getTableInfoAndKOTs', )
    return this.restaurantService.getDataRestaurantPOSDeliveryPickupView(
      CompCode,
      BranchCode
    );
  }

  @Post("updtKOTStatus")
  updtKOTStatus(@Body("data") data: any): Promise<any> {
    return this.restaurantService.updtKOTStatus(data);
  }

  @Get("getInvoiceHdr/:CompCode/:InvoiceId")
  getInvoiceHdr(
    @Param("CompCode") CompCode: any,
    @Param("InvoiceId") InvoiceId: any
  ): Promise<any> {
    // console.log("getInvoiceHdr", InvoiceId);
    return this.restaurantService.getInvoiceHdr(CompCode, InvoiceId);
  }

  @Post("uptRestarantPosKOTHdrStatus")
  uptRestarantPosKOTHdrStatus(
    @Body("CompCode") CompCode: any,
    @Body("KOTId") KOTId: any,
    @Body("KOTStatus") KOTStatus: any,
    @Body("KOTStatus") UpdtUsr: any
  ): Promise<any> {
    return this.restaurantService.uptRestarantPosKOTHdrStatus(
      CompCode,
      KOTId,
      KOTStatus,
      UpdtUsr
    );
  }

  @Post("uptRestarantPosKOTdtlStatus")
  uptRestarantPosKOTdtlStatus(
    @Body("CompCode") CompCode: any,
    @Body("KOTId") KOTId: any,
    @Body("KOTStatus") KOTStatus: any,
    @Body("KOTStatus") UpdtUsr: any
  ): Promise<any> {
    return this.restaurantService.uptRestarantPosKOTdtlStatus(
      CompCode,
      KOTId,
      KOTStatus,
      UpdtUsr
    );
  }

  @Post("updtKOTViewTableStatus")
  updtKOTViewTableStatus(@Body("data") data: any): Promise<any> {
    return this.restaurantService.updtKOTViewTableStatus(data);
  }

  @Post("restaurantPosProcessSpltTable")
  restaurantPosProcessSpltTable(@Body("data") data: any): Promise<any> {
    return this.restaurantService.restaurantPosProcessSpltTable(data);
  }

  @Post("restaurantPOSTableMergeOpration")
  restaurantPOSTableMergeOpration(@Body("data") data: any): Promise<any> {
    return this.restaurantService.restaurantPOSTableMergeOpration(data);
  }

  @Post("saveMergeTable")
  saveMergeTable(@Body("data") data: any): Promise<any> {
    return this.restaurantService.saveMergeTable(data);
  }

  @Post("saveSpltTable")
  saveSpltTable(@Body("data") data: any): Promise<any> {
    return this.restaurantService.saveSpltTable(data);
  }

  @Get("getRestaurantInvoiceDtl/:CompCode/:InvoiceId")
  getRestaurantInvoiceDtl(
    @Param("CompCode") CompCode: any,
    @Param("InvoiceId") InvoiceId: any
  ): Promise<any> {
    // console.log("getInvoiceHdr", InvoiceId);
    return this.restaurantService.getRestaurantInvoiceDtl(CompCode,InvoiceId);
  }

  // @Post("restaurantUptInvoiceHdr")
  // restaurantUptInvoiceHdr(@Body("data") data: any): Promise<any> {
  //   return this.restaurantService.restaurantUptInvoiceHdr(data);
  // }

  @Post("restaurantVoidBill")
  restaurantVoidBill(@Body("data") data: any): Promise<any> {
    // console.log(data)
    // return;
    return this.restaurantService.restaurantVoidBill(data);
  }
  @Post("updtKOTItemStatus")
  updtKOTItemStatus(@Body("data") data: any): Promise<any> {
    return this.restaurantService.updtKOTItemStatus(data);
  }

  @Post("updtRestaurantKOTStatus")
  updtRestaurantKOTStatus(@Body("data") data: any): Promise<any> {
    return this.restaurantService.updtRestaurantKOTStatus(data);
  }

  @Post("updtRestaurantPOSKOTDtlStatus")
  updtRestaurantPOSKOTDtlStatus(@Body("data") data: any): Promise<any> {
    return this.restaurantService.updtRestaurantPOSKOTDtlStatus(data);
  }

  @Get("getDataRestaurantPOS_ResentKOTs/:CompCode/:BranchCode/:CurrentUserName")
  getDataRestaurantPOS_ResentKOTs(
    @Param("CompCode") CompCode: any,
    @Param("BranchCode") BranchCode: any,
    @Param("CurrentUserName") CurrentUserName: any
  ): Promise<any> {
    // console.log("getInvoiceHdr", InvoiceId);
    return this.restaurantService.getDataRestaurantPOS_ResentKOTs(
      CompCode,
      BranchCode,
      CurrentUserName
    );
  }

  @Get(
    "getDataRestaurantPOS_ResentBills/:CompCode/:BranchCode/:CurrentUserName"
  )
  getDataRestaurantPOS_ResentBills(
    @Param("CompCode") CompCode: any,
    @Param("BranchCode") BranchCode: any,
    @Param("CurrentUserName") CurrentUserName: any
  ): Promise<any> {
    // console.log("getInvoiceHdr", InvoiceId);
    return this.restaurantService.getDataRestaurantPOS_ResentBills(
      CompCode,
      BranchCode,
      CurrentUserName
    );
  }

  @Get("fetchSelfOrderKOTData/:CompCode/:BranchCode")
  fetchSelfOrderKOTData(
    @Param("CompCode") CompCode: any,
    @Param("BranchCode") BranchCode: any
  ): Promise<any> {
    return this.restaurantService.fetchSelfOrderKOTData(CompCode, BranchCode);
  }

  @Post("uptRestaurantKOTHdrTableNo")
  uptRestaurantKOTHdrTableNo(@Body("data") data: any): Promise<any> {
    return this.restaurantService.uptRestaurantKOTHdrTableNo(data);
  }
}
