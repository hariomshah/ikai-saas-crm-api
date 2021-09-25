import { Controller, Logger, Body, Get, Post } from '@nestjs/common';
import { SlotService } from './slot.service';
import  AuthGuard  from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller('slot')
export class SlotController {
    private logger = new Logger('SlotController');

    constructor(private slot: SlotService) {

    }

    @Post('InsUpdtSlotMaster')
    insUpdtSlotMaster (
        @Body('data') data: any
    ): Promise<any> {
        return this.slot.insUpdtSlotMaster (data);
    }

    @Post('GetSlotMaster')
    getSlotMaster(
        @Body("CompCode") CompCode: any,
        // @Body('data') data:any
    ): Promise<any> {
        return this.slot.getSlotMaster(CompCode);
    }
}
