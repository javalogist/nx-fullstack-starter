import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
  private readonly logger = new Logger(CustomCacheInterceptor.name);

  constructor(
    protected override readonly reflector: Reflector,
    @Inject(CACHE_MANAGER) protected override readonly cacheManager: any
  ) {
    super(reflector, cacheManager);
  }

  protected override trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    if (request.method !== 'GET') {
      this.logger.debug(`Skipping cache for non-GET request: ${request.method} ${request.url}`);
      return undefined;
    }

    // For Fastify, we'll use the URL as the cache key
    const key = request.url;
    this.logger.debug(`Generated cache key: ${key} for ${request.method} ${request.url}`);
    return key;
  }
}
