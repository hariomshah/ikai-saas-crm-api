import { Module } from "@nestjs/common";
import { LeadsManagementController } from "./leads-management.controller";
import { LeadsManagementService } from "./leads-management.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [LeadsManagementController],
  providers: [LeadsManagementService],
})
export class LeadsManagementModule {}
