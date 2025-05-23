import {
  DynamicModule,
  Module,
  Provider,
  Type,
} from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { LocalStrategy } from './strategies/local.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { RolesGuard } from './guards/roles.guard';

import { IAuthService } from './interfaces/auth-service.interface';
import { AUTH_SERVICE_TOKEN, USER_SERVICE_TOKEN } from './constants/auth.constants';
import { jwtConfig } from './config/jwt.config';
import { IBaseUser } from '@kodevy-core-2.0/shared';

export type AuthServiceToken = typeof AUTH_SERVICE_TOKEN;
export type UserServiceToken = typeof USER_SERVICE_TOKEN;

export interface CoreAuthModuleOptions<TUser extends IBaseUser> {
  strategies: {
    jwt?: boolean;
    local?: boolean;
    google?: boolean;
  };
  authServiceToken: AuthServiceToken; // Just accept the token
  imports?: any[];
}

@Module({})
export class CoreAuthModule {
  static forRoot<TUser extends IBaseUser>(options: CoreAuthModuleOptions<TUser>): DynamicModule {
    const providers: Provider[] = [];
    const exports: Array<Type<any> | string> = [JwtModule];

    // Validate strategy config
    if (!options.strategies.jwt && !options.strategies.local && !options.strategies.google) {
      throw new Error('You must enable at least one auth strategy (jwt, local, or google)');
    }

    if (!options.authServiceToken) {
      throw new Error('You must provide an auth service token');
    }

    // Register strategies based on config
    if (options.strategies.jwt) {
      providers.push(JwtStrategy, JwtAuthGuard);
      exports.push(JwtAuthGuard);
    }

    if (options.strategies.local) {
      providers.push(LocalStrategy, LocalAuthGuard);
      exports.push(LocalAuthGuard);
    }

    if (options.strategies.google) {
      providers.push(GoogleStrategy, GoogleAuthGuard);
      exports.push(GoogleAuthGuard);
    }

    // Add RolesGuard
    providers.push(RolesGuard);
    exports.push(RolesGuard);

    return {
      module: CoreAuthModule,
      imports: [
        PassportModule,
        ConfigModule,
        ...(options.strategies.jwt
          ? [
              JwtModule.registerAsync({
                useFactory: (configService: ConfigService) => jwtConfig(configService),
                inject: [ConfigService],
              }),
            ]
          : []),
        ...(options.imports ?? []),
      ],
      providers,
      exports,
    };
  }
}