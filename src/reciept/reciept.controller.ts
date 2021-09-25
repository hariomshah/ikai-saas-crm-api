import { Controller, Logger, Body, Post, Get, Param } from "@nestjs/common";
import { RecieptService } from "./reciept.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("reciept")
export class RecieptController {
  private logger = new Logger("RecieptController");

  constructor(private reciept: RecieptService) {}

  @Get("getRecieptHdrData/:CompCode/:FromDate/:ToDate/:RecieptNo")
  getRecieptHdrData(
    @Param("CompCode") CompCode: any,
    @Param("FromDate") FromDate: any,
    @Param("ToDate") ToDate: any,
    @Param("RecieptNo") RecieptNo: any
  ): Promise<any> {
    return this.reciept.getRecieptHdrData(
      CompCode,
      FromDate,
      ToDate,
      RecieptNo
    );
  }

  @Get("getRecieptDtlData/:CompCode/:RecieptId")
  getRecieptDtlData(
    @Param("CompCode") CompCode: any,
    @Param("RecieptId") RecieptId: any
  ): Promise<any> {
    return this.reciept.getRecieptDtlData(CompCode, RecieptId);
  }

  @Post("InsUpdtRcptHdr")
  InsUpdtRcptHdr(@Body("data") data: any): Promise<any> {
    return this.reciept.InsUpdtRcptHdr(data);
  }

  @Post("DeleteRcptHdr")
  DeleteRcptHdr(
    @Body("CompCode") CompCode: any,
    @Body("RecieptId") RecieptId: any
  ): Promise<any> {
    return this.reciept.DeleteRcptHdr(CompCode,RecieptId);
  }

  @Get("getRecieptRefundHdrData/:CompCode/:FromDate/:ToDate/:RefundNo")
  getRecieptRefundHdrData(
    @Param("CompCode") CompCode: any,
    @Param("FromDate") FromDate: any,
    @Param("ToDate") ToDate: any,
    @Param("RefundNo") RefundNo: any
  ): Promise<any> {
    return this.reciept.getRecieptRefundHdrData(
      CompCode,
      FromDate,
      ToDate,
      RefundNo
    );
  }

  @Get("getRecieptRefundDtlData/:CompCode/:RefundId")
  getRecieptRefundDtlData(
    @Param("CompCode") CompCode: any,
    @Param("RefundId") RefundId: any
  ): Promise<any> {
    return this.reciept.getRecieptRefundDtlData(CompCode, RefundId);
  }

  @Post("DeleteRefund")
  DeleteRefund(@Body("data") data: any): Promise<any> {
    return this.reciept.DeleteRefund(data);
  }

  @Get("getRecieptBalAmountData/:CompCode")
  getRecieptBalAmountData(@Param("CompCode") CompCode: any): Promise<any> {
    return this.reciept.getRecieptBalAmountData(CompCode);
  }
  @Post("InsUpdtRefund")
  InsUpdtRefund(
    @Body("data") data: any,
    @Body("updtRcptHdr") updtRcptHdr: any
  ): Promise<any> {
    return this.reciept.InsUpdtRefund(data, updtRcptHdr);
  }
  @Post("updtPosInvoiceSettlementAmount")
  updtPosInvoiceSettlementAmount(@Body("data") data: any): Promise<any> {
    // console.log(data, "controller");
    return this.reciept.updtPosInvoiceSettlementAmount(data);
  }

  @Get("getRecieptHdrPOS/:CompCode/:RecieptId")
  getRecieptHdrPOS(
    @Param("CompCode") CompCode: any,
    @Param("RecieptId") RecieptId: any
  ): Promise<any> {
    return this.reciept.getRecieptHdrPOS(CompCode, RecieptId);
  }

  @Post("updateReceiptSettlementAmount")
  updateReceiptSettlementAmount(@Body("data") data: any): Promise<any> {
    // console.log(data, "controller");
    return this.reciept.updateReceiptSettlementAmount(data);
  }
  @Post("InsReceiptSettlement")
  InsReceiptSettlement(@Body("data") data: any): Promise<any> {
    // console.log(data, "controller");
    return this.reciept.InsReceiptSettlement(data);
  }
}
