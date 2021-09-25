import { Controller, Logger, Get, Post, Body,Param } from "@nestjs/common";
import { ServiceService } from "./service.service";

import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("service")
export class ServiceController {
  private logger = new Logger("ServiceController");

  constructor(private service: ServiceService) {}

  @Get("GetServiceMaster/:CompCode")
  getServiceMaster(@Param("CompCode") CompCode:any): // @Body('data') data:any
  Promise<any> {
    return this.service.getServiceMaster(CompCode);
  }

  
  @Get("Getnewserslotlocmapp/:CompCode/:LocationId/:ServiceID")
  Getnewserslotlocmapp(
    @Param("CompCode") CompCode:any,
    @Param("LocationId") LocationId: any,
    @Param("ServiceID") ServiceID: any
    
  ): Promise<any> {
    return this.service.Getnewserslotlocmapp(CompCode,LocationId,ServiceID);
  }
  

  @Post("insUpdtServiceMaster")
  insUpdtServiceMaster(@Body("data") data: any): Promise<any> {
    return this.service.insUpdtServiceMaster(data);
  }

  @Post("insUpdtServiceTypeMaster")
  insUpdtServiceTypeMaster(@Body("data") data: any): Promise<any> {
    return this.service.insUpdtServiceTypeMaster(data);
  }
}
