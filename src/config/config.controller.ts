import { Controller, Logger, Post, Body, Get, Param } from "@nestjs/common";
import { ConfigService } from "./config.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("config")
export class ConfigController {
  private logger = new Logger("ConfigController");

  constructor(private config: ConfigService) {}
  @Post("GetConfig")
  getConfig(@Body("CompCode") CompCode: any): Promise<any> {
    return this.config.getConfig(CompCode);
  }
  @Post("UpdtConfig")
  updtConfig(@Body("data") data: any): Promise<any> {
    return this.config.updtConfig(data);
  }

  @Get("getConfigData/:CompCode")
  getConfigData(@Param("CompCode") CompCode: any): Promise<any> {
    return this.config.getConfigData(CompCode);
  }
}
