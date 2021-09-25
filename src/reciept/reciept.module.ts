import { Module } from "@nestjs/common";
import { RecieptService } from "./reciept.service";
import { AuthModule } from "src/auth/auth.module";
import { RecieptController } from "./reciept.controller";

@Module({
  imports: [AuthModule],
  providers: [RecieptService],
  controllers: [RecieptController],
})
export class RecieptModule {}
