import { Logger, ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { corsConfig, WinstonLoggerService, apiVersionConfig, pipesConfig,
   setupSwagger, GlobalExceptionFilter,
    RequestLoggerInterceptor, ApiResponseInterceptor, compressionConfig
   } from '@nx-fullstack-starter/backend';
import { helmetConfig } from '@nx-fullstack-starter/backend';
import { ConfigService } from '@nestjs/config';
import fastifyCompress from '@fastify/compress';
import helmet from '@fastify/helmet';

async function bootstrap() {
  const isProd = process.env.NODE_ENV === 'production';
  const fastifyAdapter = isProd
  ? new FastifyAdapter({
      http2: true,
    })
  : new FastifyAdapter(); // plain HTTP for local dev
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );
  const configService = app.get(ConfigService);
  const globalPrefix = configService.get<string>('API_GLOBAL_PREFIX', 'api');

  // Register Fastify compression plugin
  await app.register(fastifyCompress, compressionConfig(configService));

  app.useLogger(app.get(WinstonLoggerService));
  app.setGlobalPrefix(globalPrefix);

  await app.register(helmet, helmetConfig(configService));

  app.enableCors(corsConfig(configService));

  app.enableVersioning(apiVersionConfig(configService));

  app.useGlobalPipes(new ValidationPipe(pipesConfig(configService)));

  // Setup Swagger
  setupSwagger(app, configService, globalPrefix);

// Register interceptors (order matters: logger first, then response formatter)
app.useGlobalInterceptors(
  new RequestLoggerInterceptor(),
  new ApiResponseInterceptor(app.get(Reflector)),
);

// Register the global exception filter (after interceptors)
app.useGlobalFilters(new GlobalExceptionFilter());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
