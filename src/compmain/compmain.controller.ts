import { Controller, Logger, Post, Body, Get,Param } from "@nestjs/common";
import { CompmainService } from "./compmain.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("compmain")
export class CompmainController {
  private logger = new Logger("ConfigController");
  constructor(private compain: CompmainService) {}

  @Get("getCompMain/:CompCode")
  getCompMain(@Param("CompCode") CompCode: any): Promise<any> {
    return this.compain.getCompMain(CompCode);
  }

  @Post("UpdtCompMain")
  UpdtCompMain(@Body("data") data: any): Promise<any> {
    return this.compain.UpdtCompMain(data);
  }
}
