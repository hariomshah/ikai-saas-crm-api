import { Controller, Logger, Get, Body, Post, Param } from "@nestjs/common";
import { PaymodeMasterService } from "./paymode-master.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("paymode-master")
export class PaymodeMasterController {
  private logger = new Logger("PaymodeMasterController ");
  constructor(private paymentMode: PaymodeMasterService) {}

  @Get("getPayModeMaster/:CompCode")
  getPayModeMaster(@Param("CompCode") CompCode: any): Promise<any> {
    return this.paymentMode.getPayModeMaster(CompCode);
  }

  @Post("InsUpdtPayModeMaster")
  InsUpdtPayModeMaster(@Body("data") data: any): Promise<any> {
    return this.paymentMode.InsUpdtPayModeMaster(data);
  }

  @Post("InsUpdtPaymentModeMaster")
  InsUpdtPaymentModeMaster(@Body("data") data: any): Promise<any> {
    return this.paymentMode.InsUpdtPaymentModeMaster(data);
  }

  //Created by Hari/Savrav/Goving/Sailee on 2021-03-02
  @Get("getDataBankWalletGatewayBook/:CompCode/:PayCode/:AsOfDate")
  getDataBankWalletGatewayBook(
    @Param("CompCode") CompCode: any,
    @Param("PayCode") PayCode: any,
    @Param("AsOfDate") AsOfDate: any
  ): Promise<any> {
    return this.paymentMode.getDataBankWalletGatewayBook(
      CompCode,
      PayCode,
      AsOfDate
    );
  }
  //getDataCashBankSummary
  @Get("getDataCashBankSummary/:CompCode/:AsOfDate")
  getDataCashBankSummary(
    @Param("CompCode") CompCode: any,
    @Param("AsOfDate") AsOfDate: any
  ): Promise<any> {
    return this.paymentMode.getDataCashBankSummary(CompCode, AsOfDate);
  }
  //Created by Hari/Savrav/Goving/Sailee on 2021-03-02
  @Get(
    "getDataBankWalletGatewayBookDetail/:CompCode/:PayCode/:FromDate/:ToDate"
  )
  getDataBankWalletGatewayBookDetail(
    @Param("CompCode") CompCode: any,
    @Param("PayCode") PayCode: any,
    @Param("FromDate") FromDate: any,
    @Param("ToDate") ToDate: any
  ): Promise<any> {
    return this.paymentMode.getDataBankWalletGatewayBookDetail(
      CompCode,
      PayCode,
      FromDate,
      ToDate
    );
  }

  //getDataCashBankTransferPayModes
  @Get("getDataCashBankTransferPayModes/:CompCode")
  getDataCashBankTransferPayModes(
    @Param("CompCode") CompCode: any
  ): Promise<any> {
    return this.paymentMode.getDataCashBankTransferPayModes(CompCode);
  }

  @Post("InsUpdtCashBankTransferOrAdjustments")
  InsUpdtCashBankTransferOrAdjustments(@Body("data") data: any): Promise<any> {
    return this.paymentMode.InsUpdtCashBankTransferOrAdjustments(data);
  }

  @Get("getDataChequeSettlement/:CompCode/:FromDate/:ToDate")
  getDataChequeSettlement(
    @Param("CompCode") CompCode: any,
    @Param("FromDate") FromDate: any,
    @Param("ToDate") ToDate: any
  ): Promise<any> {
    return this.paymentMode.getDataChequeSettlement(CompCode, FromDate, ToDate);
  }
  //updtCheque_Deposit_Witdraw_ReOpen
  @Post("updtCheque_Deposit_Witdraw_ReOpen")
  updtCheque_Deposit_Witdraw_ReOpen(@Body("data") data: any): Promise<any> {
    return this.paymentMode.updtCheque_Deposit_Witdraw_ReOpen(data);
  }
  @Post("DeleteCashBankTransferOrAdjustments")
  DeleteCashBankTransferOrAdjustments(@Body("data") data: any): Promise<any> {
    return this.paymentMode.DeleteCashBankTransferOrAdjustments(data);
  }
}
