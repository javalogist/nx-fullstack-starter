import { ConfigService } from '@nestjs/config';
import { HelmetOptions } from 'helmet';

/**
 * Configures Helmet security middleware for NestJS applications
 * @param configService - NestJS ConfigService instance
 * @returns HelmetOptions object
 * 
 * Environment Variables:
 * - HELMET_CSP: Content Security Policy (default: strict CSP)
 * - HELMET_HSTS: HTTP Strict Transport Security (default: true)
 * 
 * Example .env:
 * HELMET_CSP={"defaultSrc":["'self'"],"scriptSrc":["'self'","'unsafe-inline'"]}
 * HELMET_HSTS=true
 */
export const helmetConfig = (configService: ConfigService): HelmetOptions => {
  // Default Content Security Policy
  const defaultCSP = {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'"],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"],
  };

  const config: HelmetOptions = {
    contentSecurityPolicy: configService.get('HELMET_CSP')
      ? JSON.parse(configService.get<string>('HELMET_CSP', '{}'))
      : defaultCSP,
    crossOriginEmbedderPolicy: { policy: 'require-corp' },
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-site' },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'sameorigin' },
    hidePoweredBy: true,
    hsts: configService.get('HELMET_HSTS', true),
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true,
  };

  if (process.env['NODE_ENV'] === 'development') {
    console.log('Helmet Configuration:');
    console.log('- Content Security Policy:', config.contentSecurityPolicy);
    console.log('- HSTS:', config.hsts);
  }

  return config;
}; 