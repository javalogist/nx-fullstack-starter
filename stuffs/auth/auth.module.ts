import { DynamicModule, Module, Provider, Type, ClassProvider, FactoryProvider } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { IUserService } from '../user/interfaces/user-service.interface';
import { AuthService } from './services/auth.service';
import { GoogleAuthService } from './services/google-auth.service';
import { JwtService } from './services/jwt.service';
import { AUTH_SERVICE, GOOGLE_AUTH_SERVICE, DEFAULT_JWT_EXPIRES_IN } from './constants/auth.constants';

export interface AuthModuleOptions {
  // Strategy configurations
  strategies: {
    jwt?: boolean;  // Just enable/disable JWT
    local?: boolean;
    google?: boolean;  // Just enable/disable Google
  };
  // User service provider
  userService: ClassProvider<IUserService<any>> | FactoryProvider<IUserService<any>>;
}

@Module({})
export class AuthModule {
  static forRoot(options: AuthModuleOptions): DynamicModule {
    const providers: Provider[] = [];
    const exports: Array<Type<any> | string> = [];

    // Validate that at least one strategy is configured
    if (!options.strategies.jwt && !options.strategies.local && !options.strategies.google) {
      throw new Error('At least one authentication strategy must be configured');
    }

    // Add JWT strategy if configured
    if (options.strategies.jwt) {
      providers.push(
        {
          provide: JwtModule,
          useFactory: (configService: ConfigService) => {
            const secret = configService.get<string>('JWT_SECRET');
            if (!secret) {
              throw new Error('JWT_SECRET must be configured in environment variables');
            }
            const audience = configService.get<string>('JWT_AUDIENCE');
            if (!audience) {
              throw new Error('JWT_AUDIENCE must be configured in environment variables');
            }
            return JwtModule.register({
              secret,
              signOptions: { 
                expiresIn: configService.get<string>('JWT_EXPIRES_IN') || DEFAULT_JWT_EXPIRES_IN,
                audience: audience,
              },
            });
          },
          inject: [ConfigService],
        },
        JwtStrategy,
        JwtAuthGuard,
        JwtService
      );
      exports.push(JwtAuthGuard, JwtService);
    }

    // Add Local strategy if configured
    if (options.strategies.local) {
      providers.push(
        LocalStrategy,
        LocalAuthGuard
      );
      exports.push(LocalAuthGuard);
    }

    // Add Google strategy if configured
    if (options.strategies.google) {
      providers.push(
        {
          provide: GoogleStrategy,
          useFactory: (configService: ConfigService, userService: IUserService<any>) => {
            const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
            const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
            const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL');

            if (!clientID || !clientSecret || !callbackURL) {
              throw new Error('GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_CALLBACK_URL must be configured in environment variables');
            }

            return new GoogleStrategy(configService, userService);
          },
          inject: [ConfigService, options.userService.provide],
        },
        GoogleAuthGuard,
        {
          provide: GOOGLE_AUTH_SERVICE,
          useFactory: (configService: ConfigService, userService: IUserService<any>) => {
            return new GoogleAuthService(configService, userService);
          },
          inject: [ConfigService, options.userService.provide],
        }
      );
      exports.push(GoogleAuthGuard, GOOGLE_AUTH_SERVICE);
    }

    // Add user service provider
    providers.push(options.userService);

    // Add auth service
    providers.push({
      provide: AUTH_SERVICE,
      useFactory: (userService: IUserService<any>, jwtService: JwtService) => {
        return new AuthService(userService, jwtService);
      },
      inject: [options.userService.provide, JwtService],
    });
    exports.push(AUTH_SERVICE);

    // Create a guard validator that will be used to check guard usage
    const guardValidator = {
      provide: 'GUARD_VALIDATOR',
      useFactory: () => {
        return {
          validateGuard: (guard: Type<any>) => {
            if (guard === JwtAuthGuard && !options.strategies.jwt) {
              throw new Error('JwtAuthGuard cannot be used without JWT strategy configured');
            }
            if (guard === LocalAuthGuard && !options.strategies.local) {
              throw new Error('LocalAuthGuard cannot be used without Local strategy configured');
            }
            if (guard === GoogleAuthGuard && !options.strategies.google) {
              throw new Error('GoogleAuthGuard cannot be used without Google strategy configured');
            }
          }
        };
      }
    };
    providers.push(guardValidator);
    exports.push('GUARD_VALIDATOR');

    return {
      module: AuthModule,
      imports: [
        PassportModule,
        ConfigModule,
      ],
      providers,
      exports,
    };
  }
} 