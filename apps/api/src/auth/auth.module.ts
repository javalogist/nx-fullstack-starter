import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import {AUTH_SERVICE_TOKEN, CoreAuthModule, DefaultAuthService, USER_SERVICE_TOKEN } from '@kodevy-core-2.0/backend';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { MailerModule } from '@kodevy-core-2.0/backend';
@Module({
  imports: [
    CoreAuthModule.forRoot({
      strategies: {
        jwt: true,
        local: true,
      },
      userService: {
        provide: USER_SERVICE_TOKEN,
        useExisting: UserService,
      },
      userModule: UserModule,
    }),
    MailerModule,
  ],
  providers:[
    {
      provide: AUTH_SERVICE_TOKEN,
      useClass: AuthService,
    }
  ],
  controllers: [AuthController],
})
export class AuthModule {}