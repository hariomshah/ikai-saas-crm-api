import { Module } from "@nestjs/common";
import { InventoryController } from "./inventory.controller";
import { InventoryService } from "./inventory.service";
import { SysSequenceConfigmasterService } from "../sys-sequence-configmaster/sys-sequence-configmaster.service";
import { OrderportalService } from "../orderportal/orderportal.service";

@Module({
  controllers: [InventoryController],
  providers: [
    InventoryService,
    SysSequenceConfigmasterService,
    OrderportalService,
  ],
})
export class InventoryModule {}
