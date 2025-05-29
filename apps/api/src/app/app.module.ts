import { Module } from '@nestjs/common';
import { AppConfigModule, throttleConfig, WinstonLoggerService, HealthCheckModule, JwtAuthGuard, RolesGuard, MongoConnectionModule } from '@nx-fullstack-starter/backend';
import { ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
@Module({
  imports: [
    AppConfigModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: throttleConfig,
    }),
    HealthCheckModule.register(),
    
    MongoConnectionModule.forRootAsync({
      connectionName: null,
      configKey: 'MONGO_URI',
    }),
    MongoConnectionModule.forRootAsync({
      connectionName: 'user',
      configKey: 'MONGO_URI_USER',
    }),
    AuthModule,
    UserModule,
  ],
  providers: [
    WinstonLoggerService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide:APP_GUARD,
      useClass:JwtAuthGuard
    },
    {
      provide:APP_GUARD,
      useClass:RolesGuard
    },
    
  ],
})
export class AppModule {}
