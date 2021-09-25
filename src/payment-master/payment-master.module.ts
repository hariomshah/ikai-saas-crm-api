import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { PaymentMasterController } from "./payment-master.controller";
import { PaymentMasterService } from "./payment-master.service";
import { SysSequenceConfigmasterService } from "src/sys-sequence-configmaster/sys-sequence-configmaster.service";

@Module({
  imports: [AuthModule],
  controllers: [PaymentMasterController],
  providers: [PaymentMasterService, SysSequenceConfigmasterService],
})
export class PaymentMasterModule {}
