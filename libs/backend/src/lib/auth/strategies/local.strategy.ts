import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { IBaseUser } from '@kodevy-core-2.0/shared';
import { IAuthService } from '../interfaces';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor( private authService: IAuthService) {
    // 👇 customize field names if needed (default is 'username')
    super({ usernameField: 'email',passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<IBaseUser> {
    return await this.authService.validateUser(email, password);
  }
}
