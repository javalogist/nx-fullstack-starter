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
 * - API_VERSION_DEFAULT: Default version to use (default: '1')
 * - API_VERSION_DEPRECATED: Comma-separated list of deprecated versions
 * - API_VERSION_SUNSET: JSON string of version sunset dates
 * 
 * Example .env:
 * API_VERSION_STRATEGY=uri
 * API_VERSION_PREFIX=v
 * API_VERSION_DEFAULT=1
 * API_VERSION_DEPRECATED=v1,v2
 * API_VERSION_SUNSET={"v1":"2024-12-31","v2":"2025-06-30"}
 */
export const apiVersionConfig = (configService: ConfigService): VersioningOptions => {
  const strategy = configService.get('API_VERSION_STRATEGY', VersioningType.URI);
  const prefix = configService.get('API_VERSION_PREFIX', 'v');
  const defaultVersion = configService.get('API_VERSION_DEFAULT', '1');
  const deprecatedVersions = configService.get('API_VERSION_DEPRECATED', '').split(',').filter(Boolean);
  const sunsetVersions = configService.get('API_VERSION_SUNSET', '{}');

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
  if (process.env['NODE_ENV'] === 'development') {
    console.log('API Versioning Configuration:');
    console.log('- Strategy:', strategy);
    console.log('- Prefix:', prefix);
    console.log('- Default Version:', defaultVersion);
    console.log('- Deprecated Versions:', deprecatedVersions);
    console.log('- Sunset Versions:', JSON.parse(sunsetVersions));
  }

  return config;
}; 