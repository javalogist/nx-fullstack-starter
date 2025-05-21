// libs/backend/health/src/lib/health.module.ts
import { Module, DynamicModule } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { MongooseHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus';

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
