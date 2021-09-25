import { Controller, Logger, Post, Body } from '@nestjs/common';
import { StateMasterService } from './state-master.service';
import  AuthGuard  from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller('state-master')
export class StateMasterController {
    private logger = new Logger('StateMasterController');

    constructor(private state: StateMasterService) { }

    @Post('GetStateMasterData')
    getStateMasterData(
         @Body("CompCode") CompCode:any
    ): Promise<any> {
        return this.state.getStateMasterData(CompCode);
    }

    @Post('InsUpdtStateMaster')
    insUpdtStateMaster(
        @Body('data') data:any
    ): Promise<any> {
        return this.state.insUpdtStateMaster(data);
    }

}
