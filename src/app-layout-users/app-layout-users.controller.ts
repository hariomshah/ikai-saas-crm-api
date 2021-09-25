import { Controller, Logger, Post, Body, Get, Param } from "@nestjs/common";
import { AppLayoutUsersService } from "./app-layout-users.service";

@Controller('app-layout-users')
export class AppLayoutUsersController {

    private logger = new Logger("AppLayoutController");

    constructor(private service: AppLayoutUsersService) {

    }

    @Get("getAppLayout/:CompCode/:DeviceType")
    getAppLayout(@Param("CompCode") CompCode: any, @Param("DeviceType") DeviceType: any): Promise<any> {
        return this.service.getAppLayout(CompCode, DeviceType);
    }

    @Get("getAppLayoutDtl/:CompCode/:DeviceType")
    getAppLayoutDtl(@Param("CompCode") CompCode: any, @Param("DeviceType") DeviceType: any): Promise<any> {
        return this.service.getAppLayoutDtl(CompCode, DeviceType);
    }

}
