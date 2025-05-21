// libs/backend/health/src/lib/health.service.ts
import {
    Injectable,
    Optional,
  } from '@nestjs/common';
  import {
    HealthCheckService,
    MongooseHealthIndicator,
    MemoryHealthIndicator,
    HealthCheckResult,
  } from '@nestjs/terminus';
  
  @Injectable()
  export class HealthService {
    constructor(
      private health: HealthCheckService,
      private memory: MemoryHealthIndicator,
      @Optional() private mongoose?: MongooseHealthIndicator,
    ) {}
  
    check(): Promise<HealthCheckResult> {
      const checks = [
        () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      ];
  
      if (this.mongoose) {
        checks.push(() => this.mongoose.pingCheck('mongo'));
      }
  
      return this.health.check(checks);
    }
  }
  