import { Controller, Logger, Get, Body, Post, Param } from "@nestjs/common";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";
import { TransactionTypeMasterService } from "./transaction-type-master.service";

@UseGuards(AuthGuard())
@Controller("transaction-type-master")
export class TransactionTypeMasterController {
  private logger = new Logger("TransactionTypeController ");
  constructor(private service: TransactionTypeMasterService) {}

  @Get("getTransactionTypeMaster/:CompCode")
  getTransactionTypeMaster(@Param("CompCode") CompCode: any): Promise<any> {
    return this.service.getTransactionTypeMaster(CompCode);
  }

  @Get("getTranTypeConfigData/:CompCode/:BranchCode/:TranTypeCode")
  getTranTypeConfigData(
    @Param("CompCode") CompCode: any,
    @Param("BranchCode") BranchCode: any,
    @Param("TranTypeCode") TranTypeCode: any
  ): Promise<any> {
    return this.service.getTranTypeConfigData(CompCode,BranchCode, TranTypeCode);
  }

  @Post("InsUpdtTransactionTypeConfig")
  InsUpdtTransactionTypeConfig(@Body("data") data: any): Promise<any> {
    return this.service.InsUpdtTransactionTypeConfig(data);
  }

  @Post("DeleteTransactionTypeConfig")
  DeleteTransactionTypeConfig(@Body("data") data: any): Promise<any> {
    return this.service.DeleteTransactionTypeConfig(data);
  }
}
