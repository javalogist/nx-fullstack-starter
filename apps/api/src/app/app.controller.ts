import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from '@kodevy-core-2.0/backend';

@Controller()

export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }
}
