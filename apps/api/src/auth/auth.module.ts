import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import {AUTH_SERVICE_TOKEN, CoreAuthModule, DefaultAuthService, USER_SERVICE_TOKEN } from '@kodevy-core-2.0/backend';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
@Module({
  imports: [
    CoreAuthModule.forRoot({
      strategies: {
        jwt: true,
        local: true,
      },
      authService: {
        provide: AUTH_SERVICE_TOKEN,
        useClass: AuthService,
      },
      userService: {
        provide: USER_SERVICE_TOKEN,
        useExisting: UserService,
      },
      userModule: UserModule,
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}