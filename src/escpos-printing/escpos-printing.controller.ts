import { Controller, Logger, Post, Get, Body } from "@nestjs/common";
import { EscposPrintingService } from "./escpos-printing.service";

@Controller("escpos-printing")
export class EscposPrintingController {
  private logger = new Logger("EscposPrintingController");

  constructor(private escpos: EscposPrintingService) {}

  @Post("TestPrint")
  insUpdtEmployeeMaster(@Body("data") data: any): Promise<any> {
    return this.escpos.TestPrint(data);
  }
}
