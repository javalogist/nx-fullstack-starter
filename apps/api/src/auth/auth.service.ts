import { DefaultAuthService, IUserService, USER_SERVICE_TOKEN } from "@kodevy-core-2.0/backend";
import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "../user/user.schema";

@Injectable()
export class AuthService extends DefaultAuthService {
  constructor(
    jwtService: JwtService,
    @Inject(USER_SERVICE_TOKEN) userService: IUserService,
  ) {
    super(jwtService, userService);
  }

  
}

