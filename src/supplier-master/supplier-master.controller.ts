import { Controller, Logger, Body, Get, Post,Param } from "@nestjs/common";
import { SupplierMasterService } from "./supplier-master.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("supplier-master")
export class SupplierMasterController {
  private logger = new Logger("SupplierMasterController");

  constructor(private slot: SupplierMasterService) {}

  @Post("InsUpdtSupplierMaster")
  insUpdtSlotMaster(@Body("data") data: any): Promise<any> {
    return this.slot.InsUpdtSupplierMaster(data);
  }

  @Get("getSupplierMaster/:CompCode")
  getSupplierMaster(@Param("CompCode") CompCode: any): // @Body('data') data:any
  Promise<any> {
    return this.slot.getSupplierMaster(CompCode);
  }

  @Get("getDataSuppliers/:CompCode")
  getDataSuppliers(@Param("CompCode") CompCode: any): // @Body('data') data:any
  Promise<any> {
    return this.slot.getDataSuppliers(CompCode);
  }
}
