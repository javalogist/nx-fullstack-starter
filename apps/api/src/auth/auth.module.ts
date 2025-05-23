import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleAuthGuard, GoogleStrategy, MailerModule } from '@kodevy-core-2.0/backend';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@kodevy-core-2.0/backend';
import { LocalStrategy } from '@kodevy-core-2.0/backend';
import { JwtAuthGuard } from '@kodevy-core-2.0/backend';
import { LocalAuthGuard } from '@kodevy-core-2.0/backend';
import { RolesGuard } from '@kodevy-core-2.0/backend';
import { jwtConfig } from '@kodevy-core-2.0/backend';

@Module({
  imports: [
    UserModule,
    MailerModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => jwtConfig(configService),
      inject: [ConfigService],
    }),
  ],
  providers: [
    // Auth Service
    AuthService,
    
    // Strategies
    {
      provide: JwtStrategy,
      useFactory: (configService: ConfigService, authService: AuthService) => {
        return new JwtStrategy(configService, authService);
      },
      inject: [ConfigService, AuthService],
    },
    {
      provide: GoogleStrategy,
      useFactory: (configService: ConfigService, authService: AuthService) => {
        return new GoogleStrategy(configService, authService);
      },
      inject: [ConfigService, AuthService],
    },
    {
      provide: LocalStrategy,
      useFactory: (authService: AuthService) => {
        return new LocalStrategy(authService);
      },
      inject: [AuthService],
    },

    // Guards
    JwtAuthGuard,
    LocalAuthGuard,
    GoogleAuthGuard,
    RolesGuard,
  ],
  exports: [
    // Export service for other modules to use
    AuthService,
    // Export guards for route protection
    JwtAuthGuard,
    LocalAuthGuard,
    GoogleAuthGuard,
    RolesGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}