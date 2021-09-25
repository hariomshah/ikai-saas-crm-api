import { Controller, Logger, Post, Body} from '@nestjs/common';
import { UserloginlogsService } from './userloginlogs.service';
import  AuthGuard  from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller('userloginlogs')
export class UserloginlogsController {
    private logger = new Logger('UserloginlogsController');

    constructor(private userloginlogs:UserloginlogsService){}

    @Post('GetUserloginlogs')
    getUserloginlogs(
        @Body("CompCode") CompCode: any,
        @Body('FromDate') FromDate:any,
        @Body('ToDate') ToDate:any,

    ): Promise<any> {
        return this.userloginlogs.getUserloginlogs(CompCode,FromDate,ToDate);
    }
}
