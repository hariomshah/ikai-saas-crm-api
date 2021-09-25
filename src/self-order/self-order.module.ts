import { Module } from '@nestjs/common';
import { SelfOrderService } from './self-order.service';
import {SelfOrderController} from './self-order.controller'
import { RestaurantPosService } from "../restaurant-pos/restaurant-pos.service";
import { RestaurantPosModule } from "../restaurant-pos/restaurant-pos.module";
@Module({
  imports:[RestaurantPosModule,],
  controllers: [SelfOrderController],
  providers: [SelfOrderService,RestaurantPosService],
  exports:[SelfOrderService]
})
export class SelfOrderModule {}
