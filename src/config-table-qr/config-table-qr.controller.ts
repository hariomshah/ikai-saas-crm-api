import { Controller, Logger, Get, Body, Post, Param } from "@nestjs/common";
import { ConfigTableQrService } from "./config-table-qr.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("config_table_qr")
export class ConfigTableQrController {
  private logger = new Logger("ConfigureTableQRController ");
  constructor(private state: ConfigTableQrService) {}

  @Get("getConfigureTableQR/:CompCode/:BranchCode/:DeptCode")
  getConfigureTableQR(
    @Param("CompCode") CompCode: any,
    @Param("BranchCode") BranchCode: any,
    @Param("DeptCode") DeptCode: any
  ): Promise<any> {
    return this.state.getConfigureTableQR(CompCode, BranchCode, DeptCode);
  }

  @Post("InsConfigureTableQR")
  InsConfigureTableQR(@Body("data") data: any): Promise<any> {
    return this.state.InsConfigureTableQR(data);
  }

  @Post("UpdtConfigureTableQR")
  UpdtConfigureTableQR(@Body("data") data: any): Promise<any> {
    return this.state.UpdtConfigureTableQR(data);
  }
}
