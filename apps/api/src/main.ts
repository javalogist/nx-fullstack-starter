/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { corsConfig, WinstonLoggerService } from '@kodevy-core-2.0/backend';
import helmet from 'helmet';
import { helmetConfig } from '@kodevy-core-2.0/backend';
import { ConfigService } from '@nestjs/config';
import compression from 'compression';
import { compressionConfig } from '@kodevy-core-2.0/backend';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  
  app.useLogger(app.get(WinstonLoggerService));
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.use(helmet(helmetConfig(configService)));
  app.enableCors(corsConfig(configService));
  app.use(compression(compressionConfig(configService)));





  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
