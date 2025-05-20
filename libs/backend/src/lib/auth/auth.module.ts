import {
    DynamicModule,
    Module,
    Provider,
    Type,
    ClassProvider,
    FactoryProvider,
    ValueProvider
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

  import { AUTH_SERVICE, DEFAULT_JWT_EXPIRES_IN } from './constants/auth.constants';
  import { IUserService } from '../user/user-service.interface';
import { jwtConfig } from './config/jwt.config';

  export interface AuthModuleOptions {
    strategies: {
      jwt?: boolean;
      local?: boolean;
      google?: boolean;
    };
    userService: ClassProvider<IUserService<any>> | FactoryProvider<IUserService<any>>;
    authService?: ClassProvider<IAuthService> | FactoryProvider<IAuthService>;
  }
  
  @Module({})
  export class AuthModule {
    static forRoot(options: AuthModuleOptions): DynamicModule {
      const providers: Provider[] = [];
      const exports: Array<Type<any> | string> = [];
  
      // ✅ Validate strategy config
      if (!options.strategies.jwt && !options.strategies.local && !options.strategies.google) {
        throw new Error('You must enable at least one auth strategy (jwt, local, or google)');
      }
  
      // ✅ Provide the user service
      providers.push(options.userService);
  
      // 🧩 Register strategies based on config
      if (options.strategies.jwt) {
        providers.push(JwtStrategy);
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
  
      // 🧠 Main AuthService - Use custom implementation if provided, otherwise use default
      if (options.authService) {
        providers.push(options.authService);
      } else {
        providers.push({
          provide: AUTH_SERVICE,
          useFactory: (jwtService: JwtService, userService: IUserService, configService: ConfigService) => {
            return new DefaultAuthService(jwtService, userService, configService);
          },
          inject: [JwtService, options.userService.provide, ConfigService],
        });
      }
      exports.push(AUTH_SERVICE);
  
      // Final dynamic module return
      return {
        module: AuthModule,
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
        ],
        providers,
        exports,
      };
    }
  }
  