import { Controller, Logger, Get, Body, Post,Param } from "@nestjs/common";
import { RoundOffConfigService } from "./round-off-config.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller('roundOffConfig')
export class RoundOffConfigController {
    private logger = new Logger("RoundOffConfigController ");
    constructor(private roundOff: RoundOffConfigService) { }


    // spUpdtRounOffConfig
    @Post("UpdtRounOffConfig")
    UpdtRounOffConfig(@Body("data") data: any): Promise<any> {
        return this.roundOff.UpdtRounOffConfig(data);
    }


    // spGetRoundOffConfigData
    @Get("getRoundOffConfigData/:CompCode")
    getRoundOffConfigData(@Param("CompCode") CompCode  : any): Promise<any> {
        return this.roundOff.getRoundOffConfigData(CompCode);
    }
}
