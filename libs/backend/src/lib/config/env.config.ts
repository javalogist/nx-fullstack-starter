import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import mailerConfig from './mailer.config';
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvPath(),
      load: [mailerConfig],
    }),
  ],
})
export class AppConfigModule {}

function getEnvPath(): string {
  const env = process.env['NODE_ENV'];
  switch (env) {
    case 'development':
      return '.env.development';
    case 'test':
      return '.env.test';
    case 'production':
      return '.env.production';
    default:
      return '.env';
  }
}

