import { Controller, Logger, Body, Post } from '@nestjs/common';
import { ChangeService } from './change.service';

@Controller('change')
export class ChangeController {
    private logger = new Logger('ChangeController');

    constructor(private change:ChangeService){}

    @Post("ChangePassword")
    changePassword(@Body("data") data: any): Promise<any> {
      return this.change.changePassword(data);
    }
    
}
