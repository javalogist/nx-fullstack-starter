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
  
  import { JwtAuthGuard } from './guards/jwt-auth.guard';
  import { LocalAuthGuard } from './guards/local-auth.guard';
  import { GoogleAuthGuard } from './guards/google-auth.guard';
  
  import { JwtService } from './service/jwt.service';
  import { AuthService } from './service/auth.service';
  import { GoogleAuthService } from './service/google-auth.service';

  import { AUTH_SERVICE, GOOGLE_AUTH_SERVICE, DEFAULT_JWT_EXPIRES_IN } from './constants/auth.constants';
  import { IUserService } from '../user/user-service.interface';

  export interface AuthModuleOptions {
    strategies: {
      jwt?: boolean;
      local?: boolean;
      google?: boolean;
    };
    userService: ClassProvider<IUserService<any>> | FactoryProvider<IUserService<any>>;
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
        // JwtModule async config
        exports.push(JwtAuthGuard, JwtService);
      }
  
      if (options.strategies.local) {
        providers.push(LocalStrategy, LocalAuthGuard);
        exports.push(LocalAuthGuard);
      }
  
      if (options.strategies.google) {
        providers.push(GoogleStrategy, GoogleAuthGuard, {
          provide: GOOGLE_AUTH_SERVICE,
          useFactory: (config: ConfigService, jwtService: JwtService) => {
            return new GoogleAuthService(config, jwtService);
          },
          inject: [ConfigService, options.userService.provide],
        });
        exports.push(GoogleAuthGuard, GOOGLE_AUTH_SERVICE);
      }
  
      // 🧠 Main AuthService
      providers.push({
        provide: AUTH_SERVICE,
        useFactory: (userService: IUserService, jwtService: JwtService) => {
          return new AuthService(userService, jwtService);
        },
        inject: [options.userService.provide, JwtService],
      });
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
                  useFactory: (configService: ConfigService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                      expiresIn: configService.get('JWT_EXPIRES_IN') || DEFAULT_JWT_EXPIRES_IN,
                      audience: configService.get('JWT_AUDIENCE'),
                    },
                  }),
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
  