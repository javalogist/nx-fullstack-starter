import { ConfigService } from '@nestjs/config';
import { ThrottlerModuleOptions } from '@nestjs/throttler';

/**
 * Configures rate limiting options for NestJS applications
 * @param configService - NestJS ConfigService instance
 * @returns ThrottlerModuleOptions object
 * 
 * Environment Variables:
 * - THROTTLE_TTL: Time window in seconds for rate limiting (default: 60)
 * - THROTTLE_LIMIT: Maximum number of requests allowed in the time window (default: 10)
 * - THROTTLE_IGNORE_USER_AGENTS: Comma-separated list of user agents to ignore (default: none)
 * - THROTTLE_STORAGE: Storage type for rate limiting (default: 'memory')
 * 
 * Example .env:
 * THROTTLE_TTL=60
 * THROTTLE_LIMIT=100
 * THROTTLE_IGNORE_USER_AGENTS=Googlebot,Bingbot
 */
export const throttleConfig = (
  configService: ConfigService,
): ThrottlerModuleOptions => {
  const ttl = configService.get<number>('THROTTLE_TTL', 60);
  const limit = configService.get<number>('THROTTLE_LIMIT', 10);
  const ignoreUserAgents = configService
    .get<string>('THROTTLE_IGNORE_USER_AGENTS')
    ?.split(',')
    .map(agent => new RegExp(agent.trim())) ?? [];

  if (process.env['NODE_ENV'] === 'development') {
    console.log('Throttle Configuration:');
    console.log(`- TTL: ${ttl} seconds`);
    console.log(`- Limit: ${limit} requests`);
    console.log(`- Ignore User Agents: ${ignoreUserAgents.map(r => r.source).join(', ') || 'none'}`);
  }

  return {
    throttlers: [
      {
        ttl,
        limit,
      },
    ],
    ignoreUserAgents,
    // Note: Redis storage needs to be configured separately using ThrottlerStorageRedis
    // This is just a placeholder for the configuration
    storage: undefined,
  };
};
