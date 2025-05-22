import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { MailerConfig, MailerOptions, MailerResponse, MailerTemplate } from './mailer.interface';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter!: nodemailer.Transporter;
  private templates: Map<string, MailerTemplate> = new Map();

  constructor(private readonly configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const config = this.configService.get<MailerConfig>('mailer');
    if (!config) {
      throw new Error('Mailer configuration not found');
    }

    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    });
  }

  async send(options: MailerOptions): Promise<MailerResponse> {
    try {
      const template = this.templates.get(options.template);
      if (!template) {
        throw new Error(`Template ${options.template} not found`);
      }

      const mailOptions = {
        from: options.from || this.configService.get('mailer.from'),
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: this.replacePlaceholders(template.subject, options.data),
        html: this.replacePlaceholders(template.html, options.data),
        text: template.text ? this.replacePlaceholders(template.text, options.data) : undefined,
        attachments: options.attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error: any) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  registerTemplate(name: string, template: MailerTemplate) {
    this.templates.set(name, template);
  }

  private replacePlaceholders(content: string, data?: Record<string, any>): string {
    if (!data) return content;
    
    return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? data[key] : match;
    });
  }
} 