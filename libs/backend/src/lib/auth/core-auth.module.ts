import {
  DynamicModule,
  Module,
  Provider,
  Type,
  ClassProvider,
  FactoryProvider,
  ExistingProvider,
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

import { JwtService } from '@nestjs/jwt';
import { DefaultAuthService } from './service/default-auth.service';
import { IAuthService } from './interfaces/auth-service.interface';

import { AUTH_SERVICE_TOKEN, USER_SERVICE_TOKEN } from './constants/auth.constants';
import { IUserService } from '../user/user-service.interface';
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

  userModule: Type<any>;

  userService: (
    ClassProvider<IUserService<TUser>> | FactoryProvider<IUserService<TUser>> | ExistingProvider<IUserService<TUser>>
  ) & { provide: UserServiceToken };

  authService?: (
    ClassProvider<IAuthService> | FactoryProvider<IAuthService>
  ) & { provide: AuthServiceToken };
}


@Module({})
export class CoreAuthModule {
  static forRoot<TUser extends IBaseUser>(options: CoreAuthModuleOptions<TUser>): DynamicModule {
    const providers: Provider[] = [];
    const exports: Array<Type<any> | string> = [];


    // ✅ Validate strategy config
    if (!options.strategies.jwt && !options.strategies.local && !options.strategies.google) {
      throw new Error('You must enable at least one auth strategy (jwt, local, or google)');
    }

    if (!options.userService?.provide) {
      throw new Error('You must provide a userService');
    }

    if (!options.userService.provide) {
      throw new Error('[CoreAuthModule] userService must have a valid provide token');
    }


    // 🧩 Register strategies based on config
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


    // ✅ Provide the user service
    providers.push(options.userService);
    exports.push(options.userService.provide);


    // 🧠 Main AuthService - Use custom implementation if provided, otherwise use default
    if (options.authService) {
      providers.push(options.authService);
    } else {
      providers.push({
        provide: AUTH_SERVICE_TOKEN,
        useFactory: (jwtService: JwtService, userService: IUserService<TUser>, configService: ConfigService) => {
          return new DefaultAuthService(jwtService, userService, configService);
        },
        inject: [JwtService, options.userService.provide, ConfigService],
      });
    }
    exports.push(AUTH_SERVICE_TOKEN);

    // Final dynamic module return
    return {
      module: CoreAuthModule,
      imports: [
        PassportModule,
        ConfigModule,
        options.userModule,
        ...(options.strategies.jwt
          ? [
            JwtModule.registerAsync({
              useFactory: (configService: ConfigService) => jwtConfig(configService),
              inject: [ConfigService],
            }),
          ]
          : []),
      ],
      providers,
      exports,
    };
  }
}
