import { Module } from "@nestjs/common";
import { AppRouteService } from "./app-route.service";
import { AppRouteController } from "./app-route.controller";

@Module({ controllers: [AppRouteController], providers: [AppRouteService] })
export class AppRouteModule {}
