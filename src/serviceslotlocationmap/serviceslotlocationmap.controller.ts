import { Controller, Logger,Post,Body } from '@nestjs/common';
import { ServiceslotlocationmapService } from './serviceslotlocationmap.service';
import  AuthGuard  from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller('serviceslotlocationmap')
export class ServiceslotlocationmapController {
    private logger = new Logger('ServiceslotlocationmapController');

    constructor(private serviceslotlocationmap: ServiceslotlocationmapService) {}
    @Post('insUpdtservice_slot_loc_mapp')
    insUpdtservice_slot_loc_mapp (
        @Body('data') data: any
    ): Promise<any> {
        return this.serviceslotlocationmap.insUpdtservice_slot_loc_mapp (data);
    }

    @Post('GetServiceSlotLocMapp')
    getServiceSlotLocMapp(
         @Body("CompCode") CompCode:any
    ): Promise<any> {
        return this.serviceslotlocationmap.getServiceSlotLocMapp(CompCode);
    }
}

