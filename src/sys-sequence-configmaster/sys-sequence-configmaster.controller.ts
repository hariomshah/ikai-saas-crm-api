import { Controller, Logger, Get, Body, Post, Param } from "@nestjs/common";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";
import { SysSequenceConfigmasterService } from "./sys-sequence-configmaster.service";

@UseGuards(AuthGuard())
@Controller("sys-sequence-configmaster")
export class SysSequenceConfigmasterController {
  private logger = new Logger("SysSequenceConfigmasterController ");
  constructor(
    private sys_sequence_configmaster: SysSequenceConfigmasterService
  ) {}

  @Get("getSys_Sequence_ConfigMaster/:CompCode")
  getSys_Sequence_ConfigMaster(@Param("CompCode") CompCode: any): Promise<any> {
    return this.sys_sequence_configmaster.getSys_Sequence_ConfigMaster(
      CompCode
    );
  }

  @Get("spGetSequenceTrans/:CompCode")
  spGetSequenceTrans(@Param("CompCode") CompCode: any): Promise<any> {
    return this.sys_sequence_configmaster.spGetSequenceTrans(CompCode);
  }

  @Post("InsUpdtSystemSequenceConfigMaster")
  InsUpdtSystemSequenceConfigMaster(@Body("data") data: any): Promise<any> {
    return this.sys_sequence_configmaster.InsUpdtSystemSequenceConfigMaster(
      data
    );
  }

  @Post("getSequenceNextVal")
  getSequenceNextVal(@Body("data") data: any): Promise<any> {
    return this.sys_sequence_configmaster.getSequenceNextVal(data);
  }

  @Get("getSequenceTranMaster/:CompCode")
  getSequenceTranMaster(@Param("CompCode") CompCode: any): Promise<any> {
    return this.sys_sequence_configmaster.getSequenceTranMaster(CompCode);
  }
}
