import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { KeyboardHotkeyConfigController } from "./keyboard-hotkey-config.controller";
import { KeyboardHotkeyConfigService } from "./keyboard-hotkey-config.service";

@Module({
  imports: [AuthModule],
  controllers: [KeyboardHotkeyConfigController],
  providers: [KeyboardHotkeyConfigService],
})
export class KeyboardHotkeyConfigModule {}
