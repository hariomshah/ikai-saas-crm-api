import { Controller, Logger, Post, Get, Body } from "@nestjs/common";
import { CountryMasterService } from "./country-master.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("country-master")
export class CountryMasterController {
  private logger = new Logger("CountryController");
  constructor(private country: CountryMasterService) {}

  @Post("getCountryMasters")
  getCountryMasters(@Body("CompCode") CompCode: any): Promise<any> {
    return this.country.getCountryMasters(CompCode);
  }

  @Post("InsUpdtCountryMaster")
  InsUpdtCountryMaster(@Body("data") data: any): Promise<any> {
    return this.country.insUpdtCountryMaster(data);
  }
}
