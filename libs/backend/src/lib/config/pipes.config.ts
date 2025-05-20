import { ConfigService } from '@nestjs/config';
import { ValidationPipeOptions } from '@nestjs/common';

/**
 * Configures global pipes for NestJS applications
 * @param configService - NestJS ConfigService instance
 * @returns ValidationPipeOptions object
 * 
 * Environment Variables:
 * - VALIDATION_WHITELIST: Whether to strip properties that don't have decorators (default: true)
 * - VALIDATION_FORBID_NON_WHITELISTED: Whether to throw errors for non-whitelisted properties (default: true)
 * - VALIDATION_TRANSFORM: Whether to transform payloads to DTO instances (default: true)
 * 
 * Example .env:
 * VALIDATION_WHITELIST=true
 * VALIDATION_FORBID_NON_WHITELISTED=true
 * VALIDATION_TRANSFORM=true
 */
export const pipesConfig = (configService: ConfigService): ValidationPipeOptions => {
  const whitelist = configService.get('VALIDATION_WHITELIST', true);
  const forbidNonWhitelisted = configService.get('VALIDATION_FORBID_NON_WHITELISTED', true);
  const transform = configService.get('VALIDATION_TRANSFORM', true);

  const config: ValidationPipeOptions = {
    whitelist,
    forbidNonWhitelisted,
    transform,
    transformOptions: {
      enableImplicitConversion: true,
    },
    // Always enable detailed error messages in development
    ...(process.env['NODE_ENV'] === 'development' && {
      enableDebugMessages: true,
      validationError: {
        target: true,
        value: true,
      },
    }),
  };

  // Log configuration in development
  if (process.env['NODE_ENV'] === 'development') {
    console.log('Global Pipes Configuration:');
    console.log('- Whitelist:', whitelist);
    console.log('- Forbid Non-Whitelisted:', forbidNonWhitelisted);
    console.log('- Transform:', transform);
  }

  return config;
}; 