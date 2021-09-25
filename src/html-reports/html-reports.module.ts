import { Module } from "@nestjs/common";
import { HtmlReportsController } from "./html-reports.controller";
import { HtmlReportsService } from "./html-reports.service";
import { HtmlInventoryReportsService } from "./html-inventory-reports.service";

@Module({
  controllers: [HtmlReportsController],
  providers: [HtmlReportsService, HtmlInventoryReportsService],
})
export class HtmlReportsModule {}
