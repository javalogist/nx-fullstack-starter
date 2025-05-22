import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import * as compression from 'compression';

/**
 * Configures compression middleware for NestJS applications
 * @param configService - NestJS ConfigService instance
 * @returns CompressionOptions object
 * 
 * Environment Variables:
 * - COMPRESSION_LEVEL: Compression level (1-9, default: 6)
 * - COMPRESSION_THRESHOLD: Minimum size in bytes to compress (default: 1024)
 * - COMPRESSION_WINDOW_BITS: Window bits for compression (default: 15)
 * 
 * Example .env:
 * COMPRESSION_LEVEL=6
 * COMPRESSION_THRESHOLD=1024
 * COMPRESSION_WINDOW_BITS=15
 */
export const compressionConfig = (configService: ConfigService): compression.CompressionOptions => {
  const level = Number(configService.get('COMPRESSION_LEVEL', 6));
  const threshold = Number(configService.get('COMPRESSION_THRESHOLD', 1024));
  const windowBits = Number(configService.get('COMPRESSION_WINDOW_BITS', 15));


  const config: compression.CompressionOptions = {
    level: level,
    windowBits: windowBits as number,
    filter: (req: Request, res: Response) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
    // Don't compress if response is too small
    threshold,
  };

  // Log configuration in development
  if (process.env['NODE_ENV'] === 'development' && configService.get<string>('COMPRESSION_LOG', 'false') === 'true') {
    console.log('Compression Configuration:');
    console.log('- Level:', level);
    console.log('- Threshold:', threshold, 'bytes');
    console.log('- Window Bits:', windowBits);
  }

  return config;
}; 