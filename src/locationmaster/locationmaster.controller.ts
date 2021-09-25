import { Controller, Logger, Post, Body } from '@nestjs/common';
import { LocationmasterService } from './locationmaster.service';

import  AuthGuard  from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller('locationmaster')
export class LocationmasterController {
    private logger = new Logger('LocationmasterController');

    constructor(private locationmaster: LocationmasterService) {}
  
    @Post('InsUpdtLocationMaster')
    insUpdtLocationMaster (
        @Body('data') data: any
    ): Promise<any> {
        return this.locationmaster.insUpdtLocationMaster (data);
    }
    
    @Post('GetLocations')
    getLocations(
        @Body("CompCode") CompCode: any
    ): Promise<any> {
        return this.locationmaster.getLocations(CompCode);
    }
}
