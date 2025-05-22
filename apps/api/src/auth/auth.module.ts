import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import {CoreAuthModule, USER_SERVICE_TOKEN } from '@kodevy-core-2.0/backend';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    CoreAuthModule.forRoot({
      strategies: {
        jwt: true,
        local: true,
      },
      userService: {
        provide: USER_SERVICE_TOKEN,
        useClass: UserService,
      },
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}