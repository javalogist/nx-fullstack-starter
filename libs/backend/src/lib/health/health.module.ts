import { Module, DynamicModule } from '@nestjs/common';
import { TerminusModule, MongooseHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({})
export class HealthCheckModule {
  static register(): DynamicModule {
    return {
      module: HealthCheckModule,
      imports: [TerminusModule.forRoot()],
      controllers: [HealthController],
      providers: [
        HealthService,
        MemoryHealthIndicator,
        MongooseHealthIndicator
      ],
      exports: [HealthService],
    };
  }
}
