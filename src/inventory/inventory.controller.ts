import { Controller, Logger, Get, Body, Post, Param } from "@nestjs/common";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";
import { InventoryService } from "./inventory.service";

// @UseGuards(AuthGuard())
@Controller("inventory")
export class InventoryController {
  private logger = new Logger("InventoryController");
  constructor(private inv: InventoryService) {}

  @Get("invGetDataItemHelp/:CompCode/:BranchCode")
  invGetDataItemHelp(
    @Param("CompCode") CompCode: any,
    @Param("BranchCode") BranchCode: any
  ): Promise<any> {
    return this.inv.invGetDataItemHelp(CompCode, BranchCode);
  }
  //spINVValidateItemCodeInTransaction
  @Get("invValidateItemCodeInTransaction/:CompCode/:ItemCode")
  invValidateItemCodeInTransaction(
    @Param("CompCode") CompCode: any,
    @Param("ItemCode") ItemCode: any
  ): Promise<any> {
    return this.inv.invValidateItemCodeInTransaction(CompCode, ItemCode);
  }

  @Get("invGetItemCodeFromBarcode/:CompCode/:Barcode")
  invGetItemCodeFromBarcode(
    @Param("CompCode") CompCode: any,
    @Param("Barcode") Barcode: any
  ): Promise<any> {
    return this.inv.invGetItemCodeFromBarcode(CompCode, Barcode);
  }

  //spINVGetTransactionTypes
  @Get("invGetTransactionTypes/:CompCode/:TranTypeCode")
  invGetTransactionTypes(
    @Param("CompCode") CompCode: any,
    @Param("TranTypeCode") TranTypeCode: any
  ): Promise<any> {
    return this.inv.invGetTransactionTypes(CompCode, TranTypeCode);
  }

  //spINVGetItemBalanceStockDistinctByPrices
  @Get("invGetItemBalanceStockDistinctByPrices/:CompCode/:BranchCode/:ItemCode")
  invGetItemBalanceStockDistinctByPrices(
    @Param("CompCode") CompCode: any,
    @Param("BranchCode") BranchCode: any,
    @Param("ItemCode") ItemCode: any
  ): Promise<any> {
    return this.inv.invGetItemBalanceStockDistinctByPrices(
      CompCode,
      BranchCode,
      ItemCode
    );
  }

  //spINVGetItemBalanceStockDistinctByPrices
  @Get(
    "invGetItemBalanceStockDistinctByInwardSeq/:CompCode/:BranchCode/:ItemCode"
  )
  invGetItemBalanceStockDistinctByInwardSeq(
    @Param("CompCode") CompCode: any,
    @Param("BranchCode") BranchCode: any,
    @Param("ItemCode") ItemCode: any
  ): Promise<any> {
    return this.inv.invGetItemBalanceStockDistinctByInwardSeq(
      CompCode,
      BranchCode,
      ItemCode
    );
  }

  @Get("invGetOpeningStock/:CompCode/:BranchCode/:DeptCode/:ItemCode")
  invGetOpeningStock(
    @Param("CompCode") CompCode: any,
    @Param("BranchCode") BranchCode: any,
    @Param("DeptCode") DeptCode: any,
    @Param("ItemCode") ItemCode: any
  ): Promise<any> {
    // console.log('sssss',CompCode,BranchCode,ItemCode)
    return this.inv.invGetOpeningStock(
      CompCode,
      BranchCode,
      DeptCode,
      ItemCode
    );
  }

  @Post("invSaveOpeningStock")
  invSaveOpeningStock(@Body("data") data: any): Promise<any> {
    return this.inv.invSaveOpeningStock(data);
  }

  @Post("invUpdateOpeningStock")
  invUpdateOpeningStock(@Body("data") data: any): Promise<any> {
    return this.inv.invUpdateOpeningStock(data);
  }
  //invDeleteOpeningStock
  @Post("invDeleteOpeningStock")
  invDeleteOpeningStock(@Body("data") data: any): Promise<any> {
    return this.inv.invDeleteOpeningStock(data);
  }

  @Post("invSaveSaleInvoice")
  invSaveSaleInvoice(@Body("data") data: any): Promise<any> {
    return this.inv.invSaveSaleInvoice(data);
  }

  //Hari/Atul 20210225
  @Post("invSaveSaleReturnInvoice")
  invSaveSaleReturnInvoice(@Body("data") data: any): Promise<any> {
    return this.inv.invSaveSaleReturnInvoice(data);
  }

  @Post("invSavePurchaseInvoice")
  invSavePurchaseInvoice(@Body("data") data: any): Promise<any> {
    return this.inv.invSavePurchaseInvoice(data);
  }

  //Hari/Atul 20210225
  @Post("invSavePurchaseReturnInvoice")
  invSavePurchaseReturnInvoice(@Body("data") data: any): Promise<any> {
    return this.inv.invSavePurchaseReturnInvoice(data);
  }

  @Post("invSaveUpdatePurchaseInvoice")
  invSaveUpdatePurchaseInvoice(@Body("data") data: any): Promise<any> {
    return this.inv.invSaveUpdatePurchaseInvoice(data);
  }

  @Post("invDeletePurchaseInvoice")
  invDeletePurchaseInvoice(
    @Body("CompCode") CompCode: any,
    @Body("VoucherId") VoucherId: any,
    @Body("UpdtUsr") UpdtUsr: any
  ): Promise<any> {
    return this.inv.invDeletePurchaseInvoice(CompCode, VoucherId, UpdtUsr);
  }

  //
  @Post("invDeleteAdjustment")
  invDeleteAdjustment(
    @Body("CompCode") CompCode: any,
    @Body("VoucherId") VoucherId: any,
    @Body("UpdtUsr") UpdtUsr: any
  ): Promise<any> {
    return this.inv.invDeleteAdjustment(CompCode, VoucherId, UpdtUsr);
  }

  @Post("invSaveAdjustments")
  invSaveAdjustments(@Body("data") data: any): Promise<any> {
    return this.inv.invSaveAdjustments(data);
  }

  @Post("invSaveUpdateAdjustments")
  invSaveUpdateAdjustments(@Body("data") data: any): Promise<any> {
    return this.inv.invSaveUpdateAdjustments(data);
  }

  @Get("invGetAllInwardSeqInfo/:pCompCode/:pBranchCode/:pItemCode")
  invGetAllInwardSeqInfo(
    @Param("pCompCode") pCompCode: any,
    @Param("pBranchCode") pBranchCode: any,
    @Param("pItemCode") pItemCode: any
  ): Promise<any> {
    return this.inv.invGetAllInwardSeqInfo(pCompCode, pBranchCode, pItemCode);
  }

  //invGetDataStockValuationSummary
  //Added by Hari on 20210108
  @Get("invGetDataStockValuationSummary/:pCompCode/:pBranchCode/:pAsOfDate")
  invGetDataStockValuationSummary(
    @Param("pCompCode") pCompCode: any,
    @Param("pBranchCode") pBranchCode: any,
    @Param("pAsOfDate") pAsOfDate: any
  ): Promise<any> {
    return this.inv.invGetDataStockValuationSummary(
      pCompCode,
      pBranchCode,
      pAsOfDate
    );
  }

  //invGetDataStockValuationDetail
  //Added by Hari on 20210108
  @Get(
    "invGetDataStockValuationDetail/:pCompCode/:pBranchCode/:pItemCode/:pAsOfDate"
  )
  invGetDataStockValuationDetail(
    @Param("pCompCode") pCompCode: any,
    @Param("pBranchCode") pBranchCode: any,
    @Param("pItemCode") pItemCode: any,
    @Param("pAsOfDate") pAsOfDate: any
  ): Promise<any> {
    return this.inv.invGetDataStockValuationDetail(
      pCompCode,
      pBranchCode,
      pItemCode,
      pAsOfDate
    );
  }

  @Get("invGetDataMKStockOut/:CompCode")
  invGetDataMKStockOut(@Param("CompCode") CompCode: any): Promise<any> {
    return this.inv.invGetDataMKStockOut(CompCode);
  }

  @Post("invUpdateStockOutDtlMK")
  invUpdateStockOutDtlMK(@Body("data") data: any): Promise<any> {
    return this.inv.invUpdateStockOutDtlMK(data);
  }

  @Post("invGenerateInvoiceStockOutDtlMK")
  invGenerateInvoiceStockOutDtlMK(@Body("data") data: any): Promise<any> {
    return this.inv.invGenerateInvoiceStockOutDtlMK(data);
  }

  //invUpdateStockOutDtlMKArchive
  @Post("invUpdateStockOutDtlMKArchive")
  invUpdateStockOutDtlMKArchive(@Body("data") data: any): Promise<any> {
    return this.inv.invUpdateStockOutDtlMKArchive(data);
  }

  //Added by Atul on 20210122
  @Get(
    "invGetDataINVAllTranDocView/:CompCode/:pTranType/:pFromDate/:pToDate/:pRefCode/:pCurrentUserName"
  )
  invGetDataINVAllTranDocView(
    @Param("CompCode") CompCode: any,
    @Param("pTranType") pTranType: any,
    @Param("pFromDate") pFromDate: any,
    @Param("pToDate") pToDate: any,
    @Param("pRefCode") pRefCode: any,
    @Param("pCurrentUserName") pCurrentUserName: any
  ): Promise<any> {
    return this.inv.invGetDataINVAllTranDocView(
      CompCode,
      pTranType,
      pFromDate,
      pToDate,
      pRefCode,
      pCurrentUserName
    );
  }

  // invGetDataTranPurchase
  @Get("invGetDataTranPurchase/:CompCode/:pVoucherId")
  invGetDataTranPurchase(
    @Param("CompCode") CompCode: any,
    @Param("pVoucherId") pVoucherId: any
  ): Promise<any> {
    return this.inv.invGetDataTranPurchase(CompCode, pVoucherId);
  }

  @Get("invGetDataTranAdjustement/:CompCode/:pVoucherId")
  invGetDataTranAdjustement(
    @Param("CompCode") CompCode: any,
    @Param("pVoucherId") pVoucherId: any
  ): Promise<any> {
    return this.inv.invGetDataTranAdjustement(CompCode, pVoucherId);
  }

  @Get("invValidateBoxNoAdjustment/:CompCode/:pBoxNo")
  invValidateBoxNoAdjustment(
    @Param("CompCode") CompCode: any,
    @Param("pBoxNo") pBoxNo: any
  ): Promise<any> {
    return this.inv.invValidateBoxNoAdjustment(CompCode, pBoxNo);
  }

  //getInvoiceTranData
  @Get("getInvoiceTranData/:CompCode/:InvoiceId")
  getInvoiceTranData(
    @Param("CompCode") CompCode: any,
    @Param("InvoiceId") InvoiceId: any
  ): Promise<any> {
    return this.inv.getInvoiceTranData(CompCode, InvoiceId);
  }

  @Post("deleteServiceInvoice")
  deleteServiceInvoice(
    @Body("CompCode") CompCode: any,
    @Body("InvoiceId") InvoiceId: any
  ): Promise<any> {
    return this.inv.deleteServiceInvoice(CompCode, InvoiceId);
  }

  @Post("modifyServiceInvoice")
  modifyServiceInvoice(@Body("data") data: any): Promise<any> {
    return this.inv.modifyServiceInvoice(data);
  }

  // validateSalesVoucher
  @Get("validateSalesVoucher/:CompCode/:Branch/:Depart/:VoucherNo")
  getSalesVoucherData(
    @Param("CompCode") CompCode: any,
    @Param("Branch") Branch: any,
    @Param("Depart") Depart: any,
    @Param("VoucherNo") VoucherNo: any
  ): Promise<any> {
    return this.inv.validateSalesVoucher(CompCode, Branch, Depart, VoucherNo);
  }

  //spInvGetSalesVoucherData
  @Get("invGetSalesVoucherData/:CompCode/:VoucherId")
  invGetSalesVoucherData(
    @Param("CompCode") CompCode: any,
    @Param("VoucherId") VoucherId: any
  ): Promise<any> {
    return this.inv.invGetSalesVoucherData(CompCode, VoucherId);
  }

  @Post("invSaveSaleOrderInvoice")
  invSaveSaleOrderInvoice(@Body("data") data: any): Promise<any> {
    return this.inv.invSaveSaleOrderInvoice(data);
  }

  //invGetDataItemRates
  @Get("invGetDataItemRates/:CompCode/:BranchCode/:ItemCode")
  invGetDataItemRates(
    @Param("CompCode") CompCode: any,
    @Param("BranchCode") BranchCode: any,
    @Param("ItemCode") ItemCode: any
  ): Promise<any> {
    return this.inv.invGetDataItemRates(CompCode, BranchCode, ItemCode);
  }

  @Post("invDeleteSalesInvoice")
  invDeleteSalesInvoice(
    @Body("CompCode") CompCode: any,
    @Body("VoucherId") VoucherId: any,
    @Body("UpdtUsr") UpdtUsr: any
  ): Promise<any> {
    return this.inv.invDeleteSalesInvoice(CompCode, VoucherId, UpdtUsr);
  }
}
