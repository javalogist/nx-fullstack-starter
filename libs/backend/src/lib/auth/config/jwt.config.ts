import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { DEFAULT_JWT_EXPIRES_IN } from '../constants/auth.constants';

export const jwtConfig = (configService: ConfigService): JwtModuleOptions => ({
    secret: configService.get('JWT_SECRET'),
    signOptions: {
      expiresIn: configService.get('JWT_EXPIRES_IN') || DEFAULT_JWT_EXPIRES_IN,
      audience: configService.get('JWT_AUDIENCE'),
    },
});
