import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { IBaseUser } from '@nx-fullstack-starter/shared';
import { IAuthService } from '../interfaces/auth-service.interface';
import { AccessTokenPayload } from '../../types/access-token.payload';
import { AUTH_SERVICE_TOKEN, JWT_STRATEGY } from '../constants';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,JWT_STRATEGY) {
  constructor(
    private configService: ConfigService,
    @Inject(AUTH_SERVICE_TOKEN) private authService: IAuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') as string,
      audience: configService.get<string>('JWT_AUDIENCE'),
    });
  }

  async validate(payload: AccessTokenPayload): Promise<IBaseUser> {
    return this.authService.findById(payload.sub);
  }
}
