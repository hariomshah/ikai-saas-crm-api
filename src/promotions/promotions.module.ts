import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { PromotionsController } from "./promotions.controller";
import { PromotionsService } from "./promotions.service";

@Module({
  imports: [AuthModule],
  controllers: [PromotionsController],
  providers: [PromotionsService],
})
export class PromotionsModule {}
