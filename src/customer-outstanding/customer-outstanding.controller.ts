import { Controller, Logger, Get, Param, Post, Body } from "@nestjs/common";
import { CustomerOutstandingService } from "./customer-outstanding.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("custOutstanding")
export class CustomerOutstandingController {
  private logger = new Logger("CustomerOutstandingController");
  constructor(private custOutstanding: CustomerOutstandingService) {}

  @Get("getCustOutstandingData/:CompCode/:CustId")
  getCustOutstandingData(
    @Param("CompCode") CompCode: any,
    @Param("CustId") CustId: any
  ): Promise<any> {
    return this.custOutstanding.getCustOutstandingData(CompCode,CustId);
  }

  @Get("getBillSettlementData/:CompCode/:FromDate/:ToDate/:CustId")
  getBillSettlementData(
    @Param("CompCode") CompCode: any,
    @Param("FromDate") FromDate: any,
    @Param("ToDate") ToDate: any,
    @Param("CustId") CustId: any
  ): Promise<any> {
    return this.custOutstanding.getBillSettlementData(CompCode, FromDate, ToDate, CustId);
  }

  @Get("getDataReciepts/:CompCode/:CustId")
  getDataReciepts(
    @Param("CompCode") CompCode: any,
    @Param("CustId") CustId: any): Promise<any> {
    return this.custOutstanding.getDataReciepts(CompCode,CustId);
  }
  @Post("InsReceiptStlmnt")
  InsReceiptStlmnt(@Body("data") data: any): Promise<any> {
    return this.custOutstanding.InsReceiptStlmnt(data);
  }
}
