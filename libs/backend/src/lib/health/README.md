# Health Check Module

This module provides health check functionality for the application using `@nestjs/terminus`. It's designed to be modular and configurable, allowing you to enable/disable specific health checks based on your needs.

## Features

- Memory usage monitoring
- MongoDB connection health check (optional)
- Custom health indicators support
- Environment-aware configuration
- Detailed health status reporting

## Module Structure

```typescript
@Module({})
export class HealthCheckModule {
  static register(options?: { enableMongo?: boolean }): DynamicModule {
    return {
      module: HealthCheckModule,
      imports: [TerminusModule],
      controllers: [HealthController],
      providers: [
        HealthService,
        MemoryHealthIndicator,
        ...(options?.enableMongo ? [MongooseHealthIndicator] : []),
      ],
      exports: [HealthService],
    };
  }
}
```

## Usage

### 1. Basic Setup

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { HealthCheckModule } from './health/health.module';

@Module({
  imports: [
    HealthCheckModule.register(),
    // other modules
  ],
})
export class AppModule {}
```

### 2. With MongoDB Health Check

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { HealthCheckModule } from './health/health.module';

@Module({
  imports: [
    HealthCheckModule.register({ enableMongo: true }),
    // other modules
  ],
})
export class AppModule {}
```

## Health Check Endpoints

The module provides the following endpoints:

- `GET /health` - Basic health check
- `GET /health/memory` - Memory usage check
- `GET /health/mongo` - MongoDB connection check (if enabled)

## Response Format

```json
{
  "status": "ok",
  "info": {
    "memory_heap": {
      "status": "up"
    },
    "mongodb": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "memory_heap": {
      "status": "up"
    },
    "mongodb": {
      "status": "up"
    }
  }
}
```

## Environment Variables

```env
```

## Custom Health Indicators

You can add custom health indicators by extending the `HealthIndicator` class:

```typescript
// custom.health.ts
import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthCheckError } from '@nestjs/terminus';

@Injectable()
export class CustomHealthIndicator extends HealthIndicator {
  async isHealthy(key: string) {
    try {
      // Your custom health check logic
      const isHealthy = true;
      
      return this.getStatus(key, isHealthy);
    } catch (error) {
      throw new HealthCheckError(
        'CustomHealthCheck failed',
        this.getStatus(key, false)
      );
    }
  }
}
```

## Integration with Monitoring Tools

The health check endpoints can be integrated with various monitoring tools:

1. **Kubernetes Liveness/Readiness Probes**:
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
```

2. **Prometheus Metrics**:
```typescript
// health.controller.ts
@Get('metrics')
@HealthCheck()
async getMetrics() {
  return this.health.check([
    () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    // other checks
  ]);
}
```

## Best Practices

1. **Configuration**:
   - Always use environment variables for configuration
   - Set appropriate timeouts and intervals
   - Configure memory thresholds based on your application needs

2. **Monitoring**:
   - Set up alerts for health check failures
   - Monitor memory usage trends
   - Track MongoDB connection health

3. **Security**:
   - Consider adding authentication to health endpoints in production
   - Limit sensitive information in health check responses
   - Use appropriate CORS settings

4. **Performance**:
   - Keep health checks lightweight
   - Cache results when appropriate
   - Use appropriate check intervals

## Troubleshooting

Common issues and solutions:

1. **Memory Check Failing**:
   - Check if memory threshold is set too low
   - Monitor actual memory usage
   - Adjust threshold based on application needs

2. **MongoDB Check Failing**:
   - Verify MongoDB connection string
   - Check network connectivity
   - Ensure MongoDB service is running

3. **Timeout Issues**:
   - Increase timeout value if checks are slow
   - Optimize health check logic
   - Check system resources

## Contributing

When adding new health checks:

1. Follow the existing pattern
2. Add proper TypeScript types
3. Include environment variable documentation
4. Add appropriate tests
5. Update this README 