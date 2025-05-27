import { Injectable } from '@nestjs/common';
const NodeCache = require( "node-cache" );

@Injectable()
export class AuthCodeCacheService {
  private cache = new NodeCache();

  setAuthCode(code: string, userId: string, ttlSeconds = 60) {
    this.cache.set(code, userId, ttlSeconds);
  }

  getAuthCode(code: string): string | undefined {
    return this.cache.get(code);
  }

  deleteAuthCode(code: string) {
    this.cache.del(code);
  }
}
