import { Controller, Logger,Post, Body, Param,Get } from '@nestjs/common';
import { ServiceratemapService } from './serviceratemap.service';
import  AuthGuard  from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())

@Controller('serviceratemap')
export class ServiceratemapController {
    private logger = new Logger('ServiceratemapController');

    constructor(private serviceratemap: ServiceratemapService) {
    }
    @Post('InsUpdtserviceratemapping')
    InsUpdtserviceratemapping (
        @Body('data') data: any
    ): Promise<any> {
        return this.serviceratemap.insUpdtserviceratemapping (data);
    }

    @Post('Getserviceratemapping')
  getserviceratemapping(
        @Body("CompCode") CompCode:any
    ): Promise<any> {
        return this.serviceratemap.getserviceratemapping(CompCode);
    }

    @Get("Getnewserviceratemapping/:CompCode/:ServiceID/:LocationId")
    Getnewserviceratemapping(
      @Param("CompCode") CompCode: any,
      @Param("ServiceID") ServiceID: any,
      @Param("LocationId") LocationId: any
      
    ): Promise<any> {
      return this.serviceratemap.Getnewserviceratemapping(CompCode,ServiceID, LocationId);
    }

}
