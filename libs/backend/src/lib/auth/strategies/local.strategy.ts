import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DefaultAuthService } from '../service/default-auth.service';
import { IBaseUser } from '@kodevy-core-2.0/shared';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: DefaultAuthService) {
    // 👇 customize field names if needed (default is 'username')
    super({ usernameField: 'email',passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<IBaseUser> {
    return await this.authService.validateUser(email, password);
  }
}
