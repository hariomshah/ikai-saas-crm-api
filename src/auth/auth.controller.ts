import { Controller, Post, Body, ValidationPipe } from "@nestjs/common";
import { AuthCredentialsDto } from "./dto/auto-credentials.dto";
import { AuthService } from "./auth.service";
import { AuthUserMasterDto } from "./dto/auth-usermaster.dto";

@Controller("auth")
export class AuthController {
  constructor(private service: AuthService) {}

  @Post("/signup")
  signUp(@Body(ValidationPipe) body: AuthCredentialsDto): Promise<void> {
    return this.service.signUp(body);
  }

  @Post("/signin")
  signIn(
    @Body(ValidationPipe) body: AuthCredentialsDto
  ): Promise<{ accessToken: string }> {
    // console.log(body)
    return this.service.signIn(body);
  }

  @Post("/signinApp")
  signInApp(
    @Body(ValidationPipe) body: AuthCredentialsDto
  ): Promise<{ accessToken: string }> {
    // console.log(body)
    return this.service.signInApp(body);
  }

  @Post("/signInCustomer")
  signInCustomer(
    @Body(ValidationPipe) body: AuthUserMasterDto
  ): Promise<{ accessToken: string }> {
    return this.service.signInCustomer(body);
  }

  @Post("/changePassword")
  ChangePassword(
    @Body("CompCode") CompCode: any,
    @Body("UserType") UserType: any,
    @Body("UserId") UserId: any,
    @Body("NewPassword") NewPassword: any,
    @Body("UpdtUsr") UpdtUsr: any
  ): Promise<{ accessToken: string }> {
    return this.service.ChangePassword(
      CompCode,
      UserType,
      UserId,
      NewPassword,
      UpdtUsr
    );
  }
}
