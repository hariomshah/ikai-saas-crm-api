import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { LoginController } from "./login.controller";
import { LoginService } from "./login.service";
import { AuthModule } from "../auth/auth.module";
import { NotifyEventsModule } from "../notify-events/notify-events.module";
import { NotifyEmailService } from "../notify-email/notify-email.service";
import { NotifySmsService } from "../notify-sms/notify-sms.service";
import { NotifyPushNotificationService } from "../notify-push-notification/notify-push-notification.service";
import { NotifyEventsService } from "../notify-events/notify-events.service";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "../auth/jwt-strategy";

import * as config from "config";

// (config);

const jwtConfig = config.get("jwt");

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,

      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      },
    }),
    PassportModule.register({
      defaultStrategy: "jwt",
    }),
    AuthModule,
    HttpModule,
    NotifyEventsModule,
  ],
  controllers: [LoginController],
  providers: [
    LoginService,
    NotifyEmailService,
    NotifySmsService,
    NotifyPushNotificationService,
    NotifyEventsService,
  ],
})
export class LoginModule {}
