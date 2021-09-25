import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { JwtPayloadCommon } from "./jwt-payload.interface";
import { UserRepository } from "./user.repository";
import { UnauthorizedException, Inject, Injectable } from "@nestjs/common";
import { User } from "./user.entity";

import * as config from "config";
const appConfig = config.get("appConfig");

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET || config.get("jwt.secret"),
    });
  }

  async validate(payload: JwtPayloadCommon): Promise<User> {
    // console.log("im here", payload);
    let userType = "X",
      userId = "99999",
      CompCode = "1";
    if (appConfig.ENABLE_JWT_AUTH === true) {
      userType = payload.userType;
      userId = payload.userId;
      CompCode = payload.CompCode;
    }

    const data = await this.userRepository.getUserMaster(
      CompCode,
      userType,
      userId
    );

    if (!data) {
      throw new UnauthorizedException();
    }
    const user = data[0];
    return user;
  }
}
