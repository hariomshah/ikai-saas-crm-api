import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthGuard } from "@nestjs/passport";
import * as config from "config";
const appConfig = config.get("appConfig");


@Injectable()
export class AuthGuardDummy implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}

export default ()=>
{  
    if (appConfig.ENABLE_JWT_AUTH === true) {        
    return  AuthGuard('jwt')
    }
    else { return  AuthGuardDummy }
}