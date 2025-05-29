import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { IBaseUser } from '@nx-fullstack-starter/shared';
import { IAuthService } from '../interfaces';
import { AUTH_SERVICE_TOKEN, LOCAL_STRATEGY } from '../constants';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy,LOCAL_STRATEGY) {
  constructor(@Inject(AUTH_SERVICE_TOKEN) private authService: IAuthService) {
    // 👇 customize field names if needed (default is 'username')
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<IBaseUser> {
    return await this.authService.validateUser(email, password);
  }
}
