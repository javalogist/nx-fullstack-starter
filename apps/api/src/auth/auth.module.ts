import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AUTH_SERVICE_TOKEN, CoreAuthModule } from '@kodevy-core-2.0/backend';
import { AuthService } from './auth.service';
import { MailerModule } from '@kodevy-core-2.0/backend';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    MailerModule,
    CoreAuthModule.forRoot({
      strategies: {
        jwt: true,
        local: true,
      },
      authServiceToken: AUTH_SERVICE_TOKEN,
      imports: [forwardRef(() => AuthModule)],
    }),
  ],
  providers: [
    // Only register AuthService once here
    {
      provide: AUTH_SERVICE_TOKEN,
      useClass: AuthService,
    },
    // Optional: If you need to inject AuthService directly elsewhere
    AuthService,
  ],
  exports: [
    AUTH_SERVICE_TOKEN,
    // Only export if needed by other modules
    AuthService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}