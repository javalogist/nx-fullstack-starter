import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleAuthGuard, GoogleStrategy, MailerModule } from '@nx-fullstack-starter/backend';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@nx-fullstack-starter/backend';
import { LocalStrategy } from '@nx-fullstack-starter/backend';
import { LocalAuthGuard } from '@nx-fullstack-starter/backend';
import { jwtConfig } from '@nx-fullstack-starter/backend';
import { AUTH_SERVICE_TOKEN } from '@nx-fullstack-starter/backend';
import { AuthCodeCacheService } from '@nx-fullstack-starter/backend';
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
    AuthService,
    {
      provide: AUTH_SERVICE_TOKEN,
      useExisting: AuthService,
    },
    JwtStrategy,
    GoogleStrategy,
    LocalStrategy,
    LocalAuthGuard,
    GoogleAuthGuard,
    AuthCodeCacheService
  ],
  exports: [
    AuthService
  ],
  controllers: [AuthController],
})
export class AuthModule {}