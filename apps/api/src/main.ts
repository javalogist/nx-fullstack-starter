import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { corsConfig, WinstonLoggerService, apiVersionConfig, pipesConfig, setupSwagger, BusinessLogicExceptionFilter, GlobalExceptionFilter, RequestLoggerInterceptor, ApiResponseInterceptor } from '@kodevy-core-2.0/backend';
import helmet from 'helmet';
import { helmetConfig } from '@kodevy-core-2.0/backend';
import { ConfigService } from '@nestjs/config';
import compression from 'compression';
import { compressionConfig } from '@kodevy-core-2.0/backend';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const globalPrefix = configService.get<string>('API_GLOBAL_PREFIX', 'api');


  app.useLogger(app.get(WinstonLoggerService));
  app.setGlobalPrefix(globalPrefix);

  app.use(helmet(helmetConfig(configService)));
  app.enableCors(corsConfig(configService));
 // app.use(compression(compressionConfig(configService)));

  app.enableVersioning(apiVersionConfig(configService));


  app.useGlobalPipes(new ValidationPipe(pipesConfig(configService)));

  // Setup Swagger
  setupSwagger(app, configService, globalPrefix);


  app.useGlobalInterceptors(
    new RequestLoggerInterceptor(),
    new ApiResponseInterceptor(),
  )

  app.useGlobalFilters(
    new BusinessLogicExceptionFilter(),
    new GlobalExceptionFilter(),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
