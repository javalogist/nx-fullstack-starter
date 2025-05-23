import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { IBaseUser } from '@kodevy-core-2.0/shared';
import { IAuthService } from '../interfaces/auth-service.interface';
  import { AccessTokenPayload } from '../../types/access-token.payload';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: IAuthService
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
