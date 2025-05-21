// libs/backend/health/src/lib/health.service.ts
import {
  Injectable,
} from '@nestjs/common';
import {
  HealthCheckService,
  MongooseHealthIndicator,
  MemoryHealthIndicator,
  HealthCheckResult,
  HealthIndicatorResult,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private mongoose: MongooseHealthIndicator,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,

  ) { }

  check(): Promise<HealthCheckResult> {
    const checks = [
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.mongoose!.pingCheck('mongo') as Promise<HealthIndicatorResult>,
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      () => this.db.pingCheck('database')
    ];
    return this.health.check(checks);
  }
}
