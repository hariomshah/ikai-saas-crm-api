import { Module } from "@nestjs/common";
import { OrderportalService } from "./orderportal.service";
import { OrderportalController } from "./orderportal.controller";
import { AuthModule } from "../auth/auth.module";
import { SysSequenceConfigmasterService } from "../sys-sequence-configmaster/sys-sequence-configmaster.service";

@Module({
  imports: [AuthModule],
  providers: [OrderportalService, SysSequenceConfigmasterService],
  controllers: [OrderportalController],
})
export class OrderportalModule {}
