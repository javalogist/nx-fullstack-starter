import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


/**
 * Configures Swagger documentation for NestJS applications
 * @param app - NestJS application instance
 * @param configService - NestJS ConfigService instance
 * 
 * Environment Variables:
 * - APP_NAME: Name of your application (default: 'my-app')
 * - API_VERSION: API version (default: '1')
 * - SWAGGER_PATH: Path for Swagger UI (default: 'api-docs')
 * - SWAGGER_JSON_PATH: Path for Swagger JSON (default: 'swagger-json')
 * 
 * Example .env:
 * API_VERSION=1
 * SWAGGER_PATH=docs
 * SWAGGER_JSON_PATH=swagger-json
 */
export const setupSwagger = (
  app: INestApplication,
  configService: ConfigService,
  globalPrefix: string
) => {
  const appName = configService.get<string>('APP_NAME', 'my-app');
  const version = configService.get<string>('API_DEFAULT_VERSION', '1');
  const versionPrefix = configService.get<string>('API_VERSION_PREFIX', 'v');
  const description = `Swagger API Documentation for ${appName}`;
  const tags = <string[]>[];

  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'JWT-auth'
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-KEY',
        in: 'header',
      },
      'api-key'
    );

  // Add tags if configured
  tags.forEach(tag => config.addTag(tag));

  const document = SwaggerModule.createDocument(app, config.build());

  // Get Swagger UI options from config or use defaults
  const swaggerUiOptions =  {
        persistAuthorization: true,
        docExpansion: 'none',
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        syntaxHighlight: {
          theme: 'monokai',
        },
      };

  // Setup Swagger UI
  const swaggerPath = configService.get<string>('SWAGGER_PATH', 'api-docs');
  SwaggerModule.setup(swaggerPath, app, document, {
    swaggerOptions: swaggerUiOptions,
    customSiteTitle: `${appName} API Documentation`,
    customfavIcon: '/favicon.ico',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  // Expose the JSON spec
  
  const jsonPath = configService.get<string>('SWAGGER_JSON_PATH', 'swagger-json');
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get(`${globalPrefix}/${versionPrefix}/${version}/${jsonPath}`, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(document);
  });

  if (process.env['NODE_ENV'] === 'development' && configService.get<string>('SWAGGER_LOG', 'false') === 'true') {
    console.log('Swagger Configuration:');
    console.log(`- Title: ${appName}`);
    console.log(`- Version: ${version}`);
    console.log(`- Description: ${description}`);
    console.log(`- Tags: ${tags.join(', ') || 'none'}`);
    console.log(`- UI Path: /${swaggerPath}`);
    console.log(`- JSON Path: /${jsonPath}`);
  }
  
  Logger.debug('Swagger Configuration: jsonPath: '+jsonPath +' swaggerPath: '+swaggerPath);
};
