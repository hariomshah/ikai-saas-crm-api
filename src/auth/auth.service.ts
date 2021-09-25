import {
  Injectable,
  UnauthorizedException,
  Logger,
  InternalServerErrorException,
  Response,
  UnprocessableEntityException,
  BadRequestException,
  NotAcceptableException,
} from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthCredentialsDto } from "./dto/auto-credentials.dto";
import { JwtService } from "@nestjs/jwt";
// import { JwtPayload, JwtPayloadApp } from "./jwt-payload.interface";
import { JwtPayloadCommon } from "./jwt-payload.interface";
import { Connection } from "typeorm";
import { AuthUserMasterDto } from "./dto/auth-usermaster.dto";
import { fromEventPattern } from "rxjs";

@Injectable()
export class AuthService {
  private logger = new Logger("AuthService");
  constructor(
    private readonly conn: Connection,
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return await this.userRepository.signUp(authCredentialsDto);
  }
  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    // console.log(authCredentialsDto, "asdgh");
    const userData = await this.userRepository.validateUserPassword(
      authCredentialsDto
    );
    // console.log(userData);
    if (!userData) {
      throw new UnauthorizedException("Invalid Creadentials");
    }
    let userType = userData.UserType;
    let userId = userData.UserId;
    let CompCode = userData.CompCode;

    const payload: JwtPayloadCommon = { CompCode, userType, userId };
    // console.log(payload);
    const accessToken = await this.jwtService.sign(payload);
    this.logger.debug(
      `Generated JWT token with payload ${JSON.stringify(payload)}`
    );
    return {
      accessToken: accessToken,
      userData: {
        userType: userData.UserType,
        userId: userData.UserId,
        name: userData.Name,
        username: userData.UserName,
        empId: userData.UserTypeRef,
        gender: userData.gender,
        email: userData.email,
        mobileNo: userData.mobile,
        defaultPath: userData.defaultPath,
      },
    };
  }

  async signInApp(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    // console.log('ttt', authCredentialsDto)
    const userData = await this.userRepository.validateUserPasswordAttendantApp(
      authCredentialsDto
    );
    // console.log(userData);
    if (!userData) {
      throw new UnauthorizedException("Invalid Creadentials");
    }
    let userType = userData.UserType;
    let userId = userData.UserId;
    let CompCode = userData.CompCode;

    const payload: JwtPayloadCommon = { CompCode, userType, userId };
    // console.log(payload);
    const accessToken = await this.jwtService.sign(payload);
    this.logger.debug(
      `Generated JWT token with payload ${JSON.stringify(payload)}`
    );
    return {
      accessToken: accessToken,
      userData: {
        CompCode: userData.CompCode,
        userType: userData.UserType,
        userId: userData.UserId,
        name: userData.Name,
        username: userData.UserName,
        empId: userData.UserTypeRef,
        gender: userData.gender,
        email: userData.email,
        mobileNo: userData.mobile,
      },
    };
  }

  async signInCustomer(
    authUserMasterDto: AuthUserMasterDto
  ): Promise<{ accessToken: string }> {
    const res = await this.userRepository.validateAppUser(authUserMasterDto);
    // (res[0].UserId);

    // console.log("after response", res.length);

    let accessToken = "";
    if (res.length > 0 && res[0].UserId > 0) {
      const userType = authUserMasterDto.userType;
      const userId = authUserMasterDto.userId;
      const CompCode = authUserMasterDto.CompCode;

      const payload: JwtPayloadCommon = { CompCode, userType, userId };
      accessToken = await this.jwtService.sign(payload);
      this.logger.debug(
        `Generated JWT token with payload ${JSON.stringify(payload)}`
      );
    } else {
      throw new UnauthorizedException("Invalid Creadentials");
    }

    return { accessToken };
    // if (!username) {
    //   throw new UnauthorizedException('Invalid Creadentials');
    // }
    // const payload: JwtPayload = { username };
    // const accessToken = await this.jwtService.sign(payload);
    // this.logger.debug(
    //   `Generated JWT token with payload ${JSON.stringify(payload)}`,
    // );
    // return {
    //   accessToken,
    // };
  }

  async ChangePassword(
    CompCode: any,
    userType: any,
    userId: any,
    Newpassword: any,
    updt_usr: any
  ): Promise<any> {
    try {
      let query = `CALL spChangePassword (?,?,?,?,?)`;
      const res = await this.conn.query(query, [
        CompCode,
        userType,
        userId,
        Newpassword,
        updt_usr,
      ]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
    // const userData = await this.userRepository.validateChangePassword(
    //   userType,
    //   userId,
    //   Curpassword
    // );
    // console.log(userData,"francies")
    // if (userData.data===null) {
    // return new NotAcceptableException(userData.msg);
    // } else {
    //   try {
    //     let query = `CALL spChangePassword (?,?,?,?)`;
    //     const res = await this.conn.query(query, [
    //       userType,
    //       userId,
    //       Newpassword,
    //       updt_usr
    //     ]);

    //     return { message: "successful", data: res[0] };
    //   } catch (error) {
    //     this.logger.error(error);
    //     throw new InternalServerErrorException();
    //   }
    // }
  }
}
