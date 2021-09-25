import { Controller, Logger, Post, Body } from "@nestjs/common";
import { CitymasterService } from "./citymaster.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("citymaster")
export class CitymasterController {
  private logger = new Logger("CitymasterController");

  constructor(private citymaster: CitymasterService) {}

  @Post("GetCityMasterData")
  getCityMasterData(
    @Body("CompCode") CompCode: any
    // @Body('data') data:any
  ): Promise<any> {
    return this.citymaster.getCityMasterData(CompCode);
  }

  @Post("InsUpdtCityMaster")
  InsUpdtCityMaster(@Body("data") data: any): Promise<any> {
    return this.citymaster.insUpdtCityMaster(data);
  }
}
