import { Controller, Logger, Get, Body, Post,Param } from "@nestjs/common";
import { TablesMasterService } from "./tables-master.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";


@UseGuards(AuthGuard())
@Controller('tables-master')
export class TablesMasterController {
private logger = new Logger("TablesMasterController ");
constructor(private tablesmaster: TablesMasterService) {}

@Get("getTablesMaster/:CompCode")
getTablesMaster(@Param("CompCode") CompCode: any): Promise<any> {
  return this.tablesmaster.getTablesMaster(CompCode);

}
@Post("InsUpdtTablesMaster")
  InsUpdtTablesMaster(@Body("data") data: any): Promise<any> {
    return this.tablesmaster.InsUpdtTablesMaster(data);
  }
 }
