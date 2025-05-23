import { Module, DynamicModule } from '@nestjs/common';
import { TerminusModule, MongooseHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { HttpModule } from '@nestjs/axios';

@Module({})
export class HealthCheckModule {
  static register(): DynamicModule {
    return {
      module: HealthCheckModule,
      imports: [TerminusModule.forRoot(),HttpModule],
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
