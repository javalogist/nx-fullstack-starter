import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule, throttleConfig, WinstonLoggerService, HealthCheckModule, JwtAuthGuard, RolesGuard } from '@kodevy-core-2.0/backend';
import { ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AppConfigModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: throttleConfig,
    }),
    HealthCheckModule.register(),
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    WinstonLoggerService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide:'APP_GUARD',
      useClass:JwtAuthGuard
    },
    {
      provide:'APP_GUARD',
      useClass:RolesGuard
    },
    AppService,
    
  ],
})
export class AppModule {}
