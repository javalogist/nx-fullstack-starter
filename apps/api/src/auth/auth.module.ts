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
import { LocalAuthGuard } from '@kodevy-core-2.0/backend';
import { jwtConfig } from '@kodevy-core-2.0/backend';
import { AUTH_SERVICE_TOKEN } from '@kodevy-core-2.0/backend';
import { AuthCodeCacheService } from '@kodevy-core-2.0/backend';
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