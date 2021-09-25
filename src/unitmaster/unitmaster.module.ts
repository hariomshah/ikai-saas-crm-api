import { Module } from "@nestjs/common";
import { UnitmasterService } from "./unitmaster.service";
import { UnitmasterController } from "./unitmaster.controller";

@Module({
  providers: [UnitmasterService],
  controllers: [UnitmasterController],
})
export class UnitmasterModule {}
