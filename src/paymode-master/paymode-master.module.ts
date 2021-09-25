import { Module } from "@nestjs/common";
import { PaymodeMasterController } from "./paymode-master.controller";
import { PaymodeMasterService } from "./paymode-master.service";
import { SysSequenceConfigmasterService } from "../sys-sequence-configmaster/sys-sequence-configmaster.service";
@Module({
  controllers: [PaymodeMasterController],
  providers: [PaymodeMasterService, SysSequenceConfigmasterService],
})
export class PaymodeMasterModule {}
