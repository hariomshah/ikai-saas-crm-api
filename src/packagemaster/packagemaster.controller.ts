import { Controller, Logger, Post, Body } from "@nestjs/common";
import { PackagemasterService } from "./packagemaster.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";


@UseGuards(AuthGuard())
@Controller("packagemaster")
export class PackagemasterController {
  private logger = new Logger("SlotController");

  constructor(private packagemaster: PackagemasterService) {}
  @Post("InsUpdtPackageMaster")
  insUpdtPackageMaster(@Body("data") data: any): Promise<any> {
    return this.packagemaster.insUpdtPackageMaster(data);
  }
  @Post("GetPackageMaster")
  getPackageMaster(@Body("CompCode") CompCode:any): // @Body('data') data:any
  Promise<any> {
    return this.packagemaster.getPackageMaster(CompCode);
  }
}
