import { Controller, Logger, Body, Post, Get } from "@nestjs/common";
import { HomescreenService } from "./homescreen.service";

import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("homescreen")
export class HomescreenController {
  private logger = new Logger("HomescreenController");

  constructor(private homescreen: HomescreenService) {}

  @Post("insUpdtHomescreenpromos")
  insUpdtHomescreenpromos(@Body("data") data: any): Promise<any> {
    return this.homescreen.insUpdtHomescreenpromos(data);
  }

  @Post("GetHomescreenpromos")
  getHomescreenpromos(@Body("CompCode") CompCode: any): Promise<any> {
    return this.homescreen.getHomescreenpromos(CompCode);
  }
}
