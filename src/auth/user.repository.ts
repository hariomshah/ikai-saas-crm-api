import { Repository, EntityRepository, Connection } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auto-credentials.dto";
import {
  ConflictException,
  InternalServerErrorException,
  Injectable,
} from "@nestjs/common";

//import * as bcrypt from "bcryptjs";
import { AuthUserMasterDto } from "./dto/auth-usermaster.dto";

import * as config from "config";

//const Cryptr = require("cryptr");
const appConfig = config.get("appConfig");
const bcrypt = require("bcryptjs");

@Injectable()
export class UserRepository {
  constructor(private readonly conn: Connection) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();

    queryRunner.startTransaction();
    try {
      queryRunner.query(
        `insert into usermaster (UserType, username,password) values('A','${username}','${password}')`
      );

      queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.code === "23505") {
        // duplicate username
        throw new ConflictException("Username already exists");
      } else {
        throw new InternalServerErrorException();
      }
    } finally {
      await queryRunner.release();
    }
  }

  async getUser(CompCode, username): Promise<User> {
    const data = await this.conn.query(
      `select * from usermaster where CompCode = '${CompCode}' and username='${username}'`
    );
    // console.log('d2',data);
    return data;
  }

  async getUserMaster(CompCode, userType, userId): Promise<User> {
    const data = await this.conn.query(
      `select * from usermaster where CompCode = '${CompCode}' and UserType='${userType}' and userId = ${userId}`
    );
    // console.log('d2',data);
    return data;
  }

  async getAppUser(CompCode, username): Promise<User> {
    const data = await this.conn.query(
      `select * from users where CompCode = '${CompCode}' and username='${username}'`
    );
    return data;
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hashSync(password, salt);
  }
  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto
  ): Promise<any> {
    const { username, CompCode, password } = authCredentialsDto;

    // const cryptr = new Cryptr(appConfig.CRYPTO_SECRET_KEY);
    // console.log('hey tehre',username, password)
    const data = await this.getUser(CompCode, username);
    // console.log("hey tehre 1", data);
    // if (cryptr.decrypt(password) === cryptr.decrypt(data[0].password)) {
    return data[0];
    // } else {
    //   return null;
    // }
  }

  async validateUserPasswordDecrypt(
    authCredentialsDto: AuthCredentialsDto
  ): Promise<any> {
    const { username, password,CompCode } = authCredentialsDto;
    // console.log("ssss", authCredentialsDto);
    // const cryptr = new Cryptr(appConfig.CRYPTO_SECRET_KEY);
    // console.log('hey tehre',username, password)
    const data = await this.getUser(CompCode,username);
    // console.log(data[0]);
    return data[0];

    // console.log("hey tehre 1", data[0]);
    // if (data[0] && password === cryptr.decrypt(data[0].password)) {
    //   return data[0];
    // } else {
    //   return null;
    // }
  }

  async validateUserPasswordAttendantApp(
    authCredentialsDto: AuthCredentialsDto
  ): Promise<any> {
    const { username, password,CompCode } = authCredentialsDto;
    // console.log("ssss", authCredentialsDto);
    // const cryptr = new Cryptr(appConfig.CRYPTO_SECRET_KEY);
    // console.log('hey tehre',username, password)
    const data = await this.getUser(CompCode, username);

    const passStatus = await bcrypt.compareSync(password, data[0].password);
    // console.log(data[0], passStatus);
    if (passStatus === false) {
      return null;
    } else {
      return data[0];
    }
  }

  //Hari on 20200118
  async validateAppUser(authUserMasterDto: AuthUserMasterDto): Promise<any> {
    const { userType, userId, mobileno } = authUserMasterDto;
    // console.log(`select * from usermaster where userType = '${userType}' and userId = ${userId} and mobile = '${mobileno}'`)
    return await this.conn.query(
      `select * from usermaster where userType = '${userType}' and userId = ${userId} and mobile = '${mobileno}'`
    );
  }

  async validateChangePassword(
    pUserType: any,
    pUserId: any,
    pPassword: any
  ): Promise<any> {
    const userType = pUserType;
    const userId = pUserId;
    const password = pPassword;
    // const cryptr = new Cryptr(appConfig.CRYPTO_SECRET_KEY);
    // console.log("hey tehre", userType, userId, password);
    const data = await this.getUserId(userType, userId);
    // console.log("hey tehre 1", data);
    // try {
    //   if (cryptr.decrypt(password) === cryptr.decrypt(data[0].password)) {
    //     return { msg: "successfull", data: data[0] };
    //   }
    // } catch {
    //   // console.log("incorrect password")
    //   return { msg: "Invalid Current Password", data: null };
    // }
  }

  async getUserId(userType, userId): Promise<User> {
    const data = await this.conn.query(
      `select * from usermaster where UserType='${userType}' and UserId='${userId}'`
    );
    // console.log('d2',data);
    return data;
  }
}
