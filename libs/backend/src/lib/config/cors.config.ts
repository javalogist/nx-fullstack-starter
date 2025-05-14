// src/config/cors.config.ts
import { ConfigService } from '@nestjs/config';

export const corsConfig = (configService: ConfigService) => {
  const allowedOrigins = configService
    .get<string>('ALLOWED_ORIGINS')
    ?.split(',')
    .map((origin) => origin.trim()) ?? ['http://localhost:3000'];

  const allowedMethods = configService
    .get<string>('ALLOWED_METHODS')
    ?.split(',')
    .map((method) => method.trim()) ?? ['GET'];

  const allowCredentials = configService.get<boolean>('ALLOW_CREDENTIALS') ?? true;

  if (process.env['NODE_ENV'] === 'development') {
    console.log(`CORS Config: Origins - ${allowedOrigins.join(', ')}, Methods - ${allowedMethods.join(', ')}`);
  }

  return {
    origin: allowedOrigins,
    methods: allowedMethods,
    credentials: allowCredentials,
  };
};
