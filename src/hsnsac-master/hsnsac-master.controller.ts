import { Controller, Logger, Post, Body,Get ,Param} from '@nestjs/common';
import { HsnsacMasterService } from './hsnsac-master.service';
import  AuthGuard  from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@Controller('hsnsac-master')
export class HsnsacMasterController {
    private logger = new Logger('HsnsacMasterController');

    constructor(private state: HsnsacMasterService) { }

    @Get("getHSNSACmaster/:CompCode")
    getHSNSACmaster(@Param("CompCode") CompCode: any): Promise<any> {
      return this.state.getHSNSACmaster(CompCode);
    }

    @Post('InsUpdtHSNSACmaster')
    InsUpdtHSNSACmaster(
        @Body('data') data:any
    ): Promise<any> {
        return this.state.InsUpdtHSNSACmaster(data);
    }

}
