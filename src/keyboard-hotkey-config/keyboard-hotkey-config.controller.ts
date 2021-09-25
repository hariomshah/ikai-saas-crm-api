import { Controller, Logger, Get, Body, Post,Param } from "@nestjs/common";
import { KeyboardHotkeyConfigService } from "./keyboard-hotkey-config.service";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("keyboard-hotkey-config")
export class KeyboardHotkeyConfigController {
  private logger = new Logger("KeyboardHotkeyConfigController ");
  constructor(private keyboardHotKeys: KeyboardHotkeyConfigService) {}

  @Get("getKeyboardHotConfig/:CompCode")
  getKeyboardHotConfig(@Param("CompCode") CompCode: any): Promise<any> {
    return this.keyboardHotKeys.getKeyboardHotConfig(CompCode);
  }

  @Post("UpdtHotKeyConfigDtl")
  UpdtHotKeyConfigDtl(@Body("data") data: any): Promise<any> {
    return this.keyboardHotKeys.UpdtHotKeyConfigDtl(data);
  }
}
