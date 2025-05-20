// src/config/cors.config.ts
import { ConfigService } from '@nestjs/config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

/**
 * Configures CORS options for NestJS applications
 * @param configService - NestJS ConfigService instance
 * @returns CorsOptions object
 * 
 * Environment Variables:
 * - ALLOWED_ORIGINS: Comma-separated list of allowed origins (default: http://localhost:3000)
 * - ALLOWED_METHODS: Comma-separated list of allowed HTTP methods (default: GET)
 * - ALLOW_CREDENTIALS: Whether to allow credentials (default: true)
 * - MAX_AGE: How long the results of a preflight request can be cached (default: 3600)
 * - ALLOWED_HEADERS: Comma-separated list of allowed headers (default: Content-Type,Authorization)
 * - EXPOSED_HEADERS: Comma-separated list of exposed headers (default: Content-Range,X-Content-Range)
 */
export const corsConfig = (configService: ConfigService): CorsOptions => {
  const allowedOrigins = configService
    .get<string>('ALLOWED_ORIGINS')
    ?.split(',')
    .map((origin) => origin.trim()) ?? ['http://localhost:3000'];

  const allowedMethods = configService
    .get<string>('ALLOWED_METHODS')
    ?.split(',')
    .map((method) => method.trim()) ?? ['GET'];

  const allowedHeaders = configService
    .get<string>('ALLOWED_HEADERS')
    ?.split(',')
    .map((header) => header.trim()) ?? ['Content-Type', 'Authorization'];

  const exposedHeaders = configService
    .get<string>('EXPOSED_HEADERS')
    ?.split(',')
    .map((header) => header.trim()) ?? ['Content-Range', 'X-Content-Range'];

  const allowCredentials = configService.get<boolean>('ALLOW_CREDENTIALS') ?? true;
  const maxAge = configService.get<number>('MAX_AGE') ?? 3600;

  if (process.env['NODE_ENV'] === 'development') {
    console.log('CORS Configuration:');
    console.log(`- Origins: ${allowedOrigins.join(', ')}`);
    console.log(`- Methods: ${allowedMethods.join(', ')}`);
    console.log(`- Headers: ${allowedHeaders.join(', ')}`);
    console.log(`- Exposed Headers: ${exposedHeaders.join(', ')}`);
    console.log(`- Credentials: ${allowCredentials}`);
    console.log(`- Max Age: ${maxAge}s`);
  }

  return {
    origin: allowedOrigins,
    methods: allowedMethods,
    allowedHeaders,
    exposedHeaders,
    credentials: allowCredentials,
    maxAge,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };
};
