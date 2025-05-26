import { ConfigService } from '@nestjs/config';
import { FastifyCompressOptions } from '@fastify/compress';

/**
 * Configures compression middleware for Fastify applications
 * @param configService - NestJS ConfigService instance
 * @returns FastifyCompressOptions object
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
export const compressionConfig = (configService: ConfigService): FastifyCompressOptions => {
  const level = Number(configService.get('COMPRESSION_LEVEL', 6));
  const threshold = Number(configService.get('COMPRESSION_THRESHOLD', 1024));
  const windowBits = Number(configService.get('COMPRESSION_WINDOW_BITS', 15));

  const config: FastifyCompressOptions = {
    global: true,
    encodings: ['gzip', 'deflate', 'br'],
    inflateIfDeflated: true,
    threshold,
    zlibOptions: {
      level,
      windowBits
    }
  };

  // Log configuration in development
  if (process.env['NODE_ENV'] === 'development' && configService.get<string>('COMPRESSION_LOG', 'false') === 'true') {
    console.log('Compression Configuration:');
    console.log('- Level:', level);
    console.log('- Threshold:', threshold, 'bytes');
    console.log('- Window Bits:', windowBits);
    console.log('- Encodings:', config.encodings);
  }

  return config;
}; 