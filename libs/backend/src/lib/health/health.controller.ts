// libs/backend/health/src/lib/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';
import { HealthService } from './health.service';
import { Public } from '../auth/decorators/public.decorator';
import { BaseController } from '../controller/base.controller';
@Controller('health')
@Public()
export class HealthController extends BaseController {

  constructor(private readonly healthService: HealthService) {
    super();
  }

  @Get()
  @HealthCheck()
  check() {
    const healthCheck = this.healthService.check();
    return this.success(healthCheck, 'Health check completed successfully');
  }
}
