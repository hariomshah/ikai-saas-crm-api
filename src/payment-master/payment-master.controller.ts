import { Controller, Logger, Body, Post, Get, Param } from "@nestjs/common";
import { PaymentMasterService } from "./payment-master.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("payment-master")
export class PaymentMasterController {
  private logger = new Logger("PaymentMasterController");

  constructor(private service: PaymentMasterService) {}

  @Get("getPaymentHdrData/:CompCode/:FromDate/:ToDate/:PaymentNo")
  getPaymentHdrData(
    @Param("CompCode") CompCode: any,
    @Param("FromDate") FromDate: any,
    @Param("ToDate") ToDate: any,
    @Param("PaymentNo") PaymentNo: any
  ): Promise<any> {
    return this.service.getPaymentHdrData(
      CompCode,
      FromDate,
      ToDate,
      PaymentNo
    );
  }

  @Get("getPaymentDtlData/:CompCode/:PaymentId")
  getPaymentDtlData(
    @Param("CompCode") CompCode: any,
    @Param("PaymentId") PaymentId: any
  ): Promise<any> {
    return this.service.getPaymentDtlData(CompCode, PaymentId);
  }

  @Get("getReceiptAndPayments/:CompCode/:TranType/:FromDate/:ToDate")
  getReceiptAndPayments(
    @Param("CompCode") CompCode: any,
    @Param("TranType") TranType: any,
    @Param("FromDate") FromDate: any,
    @Param("ToDate") ToDate: any
  ): Promise<any> {
    return this.service.getReceiptAndPayments(
      CompCode,
      TranType,
      FromDate,
      ToDate
    );
  }

  //spGetReceiptAndPaymentsWithDetails
  @Get("getReceiptAndPaymentsWithDetails/:CompCode/:TranType/:TranId")
  getReceiptAndPaymentsWithDetails(
    @Param("CompCode") CompCode: any,
    @Param("TranType") TranType: any,
    @Param("TranId") TranId: any
  ): Promise<any> {
    return this.service.getReceiptAndPaymentsWithDetails(
      CompCode,
      TranType,
      TranId
    );
  }

  //getReceiptAndPaymentReferenceHelp
  @Get("getReceiptAndPaymentReferenceHelp/:CompCode")
  getReceiptAndPaymentReferenceHelp(
    @Param("CompCode") CompCode: any
  ): Promise<any> {
    return this.service.getReceiptAndPaymentReferenceHelp(CompCode);
  }

  //getDataDayBookDetails
  @Get("getDataDayBookDetails/:CompCode/:FromDate/:ToDate")
  getDataDayBookDetails(
    @Param("CompCode") CompCode: any,
    @Param("FromDate") FromDate: any,
    @Param("ToDate") ToDate: any
  ): Promise<any> {
    return this.service.getDataDayBookDetails(CompCode, FromDate, ToDate);
  }

  @Post("saveInsReceiptAndPayment")
  saveInsReceiptAndPayment(@Body("data") data: any): Promise<any> {
    // console.log(data)
    return this.service.saveInsReceiptAndPayment(data);
  }

  @Post("deleteReceiptAndPayment")
  deleteReceiptAndPayment(
    @Body("CompCode") CompCode: any,
    @Body("TranType") TranType: any,
    @Body("TranId") TranId: any
  ): Promise<any> {
    return this.service.deleteReceiptAndPayment(CompCode, TranType, TranId);
  }

  @Get("getDataCashBookDetails/:CompCode/:FromDate/:ToDate")
  getDataCashBookDetails(
    @Param("CompCode") CompCode: any,
    @Param("FromDate") FromDate: any,
    @Param("ToDate") ToDate: any
  ): Promise<any> {
    return this.service.getDataCashBookDetails(CompCode, FromDate, ToDate);
  }

  @Get("getDataPartyOutstandingSummary/:CompCode/:PartyId/:FromDate/:ToDate")
  getDataPartyOutstandingSummary(
    @Param("CompCode") CompCode: any,
    @Param("PartyId") PartyId: any,
    @Param("FromDate") FromDate: any,
    @Param("ToDate") ToDate: any
  ): Promise<any> {
    return this.service.getDataPartyOutstandingSummary(
      CompCode,
      PartyId,
      FromDate,
      ToDate
    );
  }

  @Get("getDataPartyOutstandingDetail/:CompCode/:PartyId/:FromDate/:ToDate")
  getDataPartyOutstandingDetail(
    @Param("CompCode") CompCode: any,
    @Param("PartyId") PartyId: any,
    @Param("FromDate") FromDate: any,
    @Param("ToDate") ToDate: any
  ): Promise<any> {
    return this.service.getDataPartyOutstandingDetail(
      CompCode,
      PartyId,
      FromDate,
      ToDate
    );
  }
}
