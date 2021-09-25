import { Module } from "@nestjs/common";
import { BrandmasterService } from "./brandmaster.service";
import { BrandmasterController } from "./brandmaster.controller";

@Module({
  providers: [BrandmasterService],
  controllers: [BrandmasterController],
})
export class BrandmasterModule {}
