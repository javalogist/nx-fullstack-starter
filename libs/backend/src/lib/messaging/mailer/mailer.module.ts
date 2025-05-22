import { Global, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerService } from './mailer.service';
import { EMAIL_TEMPLATES } from './mailer.template';

@Module({
  imports: [ConfigModule],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule implements OnModuleInit {
  constructor(private readonly mailerService: MailerService) {}
  onModuleInit() {
    for (const [name, template] of Object.entries(EMAIL_TEMPLATES)) {
      this.mailerService.registerTemplate(name, template);
    }
  }
} 