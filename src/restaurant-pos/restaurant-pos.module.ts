import { Module } from "@nestjs/common";
import { RestaurantPosController } from "./restaurant-pos.controller";
import { RestaurantPosService } from "./restaurant-pos.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [RestaurantPosController],
  providers: [RestaurantPosService],
  exports: [RestaurantPosService]
})
export class RestaurantPosModule {}
