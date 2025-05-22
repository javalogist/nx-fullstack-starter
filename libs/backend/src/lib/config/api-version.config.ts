import { ConfigService } from '@nestjs/config';
import { VersioningOptions, VersioningType } from '@nestjs/common';

/**
 * Configures API versioning for NestJS applications
 * @param configService - NestJS ConfigService instance
 * @returns VersioningOptions object
 * 
 * Environment Variables:
 * - API_VERSION_STRATEGY: Versioning strategy to use (default: 'uri')
 * - API_VERSION_PREFIX: Prefix for version numbers (default: 'v')
 * - API_DEFAULT_VERSION: Default version to use (default: '1')
 * 
 * Example .env:
 * API_VERSION_STRATEGY=uri
 * API_VERSION_PREFIX=v
 * API_DEFAULT_VERSION=1
 */
export const apiVersionConfig = (configService: ConfigService): VersioningOptions => {
  const strategy = configService.get('API_VERSION_STRATEGY', VersioningType.URI);
  const prefix = configService.get('API_VERSION_PREFIX', 'v');
  const defaultVersion = configService.get('API_DEFAULT_VERSION', '1');

  const config: VersioningOptions = {
    type: VersioningType.URI,
    prefix,
    defaultVersion,
  };

  // Add custom options based on strategy
  if (strategy === VersioningType.HEADER) {
    (config as any).header = 'X-API-Version';
  } else if (strategy === VersioningType.MEDIA_TYPE) {
    (config as any).mediaType = 'application/vnd.company';
  }

  // Log configuration in development
  if (process.env['NODE_ENV'] === 'development' && configService.get<string>('API_VERSION_LOG', 'false') === 'true') {
    console.log('API Versioning Configuration:');
    console.log('- Strategy:', strategy);
    console.log('- Prefix:', prefix);
    console.log('- Default Version:', defaultVersion);
  }

  return config;
}; 