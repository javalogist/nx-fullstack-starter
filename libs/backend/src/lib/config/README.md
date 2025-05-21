# Backend Configuration Modules

This directory contains the core configuration modules for the NestJS backend application. Each module is designed to be modular and environment-aware.

## 1. Environment Configuration (`env.config.ts`)

**Purpose**: Sets up the base configuration module with environment-specific settings.
**Usage**:
```typescript
// app.module.ts
import { AppConfigModule } from './config/env.config';

@Module({
  imports: [
    AppConfigModule,
    // other modules
  ],
})
```
**Environment Files**:
- `.env.development` - Development environment
- `.env.test` - Testing environment
- `.env.production` - Production environment
- `.env` - Default fallback


## 2. Logger Configuration (`logger.config.ts`)

**Purpose**: Implements a custom Winston-based logger with MongoDB integration for production.
**Features**:
- Colorized console output
- MongoDB logging in production
- Separate collections for info and error logs
- Timestamp and context support
- Environment-aware logging levels
**Required Environment Variables**:
```env
NODE_ENV=development|production
MONGO_URI=mongodb://...
APP_NAME=YourAppName
```

**Usage**:
```typescript
// main.ts
import { WinstonConfig } from './config/logger.config';
 app.useLogger(app.get(WinstonConfig));

// any.service.ts
@Injectable()
export class AnyService {
  constructor(private readonly logger: Logger) {}

  someMethod() {
    this.logger.log('Info message', 'Context');
    this.logger.error('Error message', 'Stack trace', 'Context');
  }
}
```


## 3. Compression Configuration (`compression.config.ts`)

**Purpose**: Configures response compression with customizable settings.

**Features**:
- Configurable compression level
- Size threshold for compression
- Window bits configuration
- Client-side compression control
- Development mode logging

**Required Environment Variables**:
```env
COMPRESSION_LEVEL=6
COMPRESSION_THRESHOLD=1024
COMPRESSION_WINDOW_BITS=15
```

**Usage**:
```typescript
// main.ts
import { compressionConfig } from './config/compression.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.use(compression(compressionConfig(configService)));
  await app.listen(3000);
}
```


## 4. API Version Configuration (`api-version.config.ts`)

**Purpose**: Manages API versioning strategy.

**Features**:
- Header-based versioning
- URI-based versioning
- Version prefix configuration
- Default version fallback

**Required Environment Variables**:
```env
API_VERSION=v1
API_VERSIONING_TYPE=header|uri
API_PREFIX=api
```

**Usage**:
```typescript
// main.ts
import { apiVersionConfig } from './config/api-version.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning(apiVersionConfig());
  await app.listen(3000);
}

// example.controller.ts
@Controller('users')
@Version('1')
export class UsersControllerV1 {
  @Get()
  findAll() {
    return 'Version 1';
  }
}
```

## 5. Security Configurations

### Helmet Configuration (`helmet.config.ts`)
**Purpose**: Configures security headers.

**Features**:
- Content Security Policy
- XSS Protection
- Frame Protection
- DNS Prefetch Control

**Required Environment Variables**:
```env
HELMET_ENABLED=true
CSP_ENABLED=true
```

### CORS Configuration (`cors.config.ts`)
**Purpose**: Manages Cross-Origin Resource Sharing.

**Features**:
- Configurable origins
- Method restrictions
- Credential handling
- Header management

**Required Environment Variables**:
```env
CORS_ORIGIN=*
CORS_METHODS=GET,HEAD,PUT,PATCH,POST,DELETE
CORS_CREDENTIALS=true
```


## 6. Documentation Configuration (`swagger.config.ts`)

**Purpose**: Sets up API documentation using Swagger/OpenAPI.

**Features**:
- API title and description
- Version information
- Security schemes
- Tag organization
- Response examples

**Required Environment Variables**:
```env
SWAGGER_TITLE=API Documentation
SWAGGER_DESCRIPTION=API Documentation
SWAGGER_VERSION=1.0
```

## 7. Rate Limiting (`throttle.config.ts`)

**Purpose**: Implements request rate limiting.

**Features**:
- Time-based limiting
- Request count tracking
- IP-based limiting
- Custom storage options

**Required Environment Variables**:
```env
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

## Complete Setup Example

```typescript

// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { compressionConfig } from './config/compression.config';
import { apiVersionConfig } from './config/api-version.config';
import { helmetConfig } from './config/helmet.config';
import { corsConfig } from './config/cors.config';
import { swaggerConfig } from './config/swagger.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Apply configurations
  app.use(compression(compressionConfig(configService)));
  app.enableVersioning(apiVersionConfig());
  app.use(helmet(helmetConfig()));
  app.enableCors(corsConfig());
  
  // ✅ Setup Swagger
  setupSwagger(app, configService);
  
  await app.listen(3000);
}
bootstrap();
```

## Environment Variables Template

Create a `.env` file with these variables:

```env
# Environment
NODE_ENV=development
APP_NAME=MyApp

# MongoDB
MONGO_URI=mongodb://localhost:27017/myapp

# Compression
COMPRESSION_LEVEL=6
COMPRESSION_THRESHOLD=1024
COMPRESSION_WINDOW_BITS=15

# API
API_VERSION=v1
API_VERSIONING_TYPE=header
API_PREFIX=api

# Security
HELMET_ENABLED=true
CSP_ENABLED=true
CORS_ORIGIN=*
CORS_METHODS=GET,HEAD,PUT,PATCH,POST,DELETE
CORS_CREDENTIALS=true

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# Swagger
SWAGGER_TITLE=API Documentation
SWAGGER_DESCRIPTION=API Documentation
SWAGGER_VERSION=1.0
``` 