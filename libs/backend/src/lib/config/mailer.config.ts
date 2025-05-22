// src/config/mailer.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('mailer', () => ({
  host: process.env['MAIL_HOST'],
  port: parseInt(process.env['MAIL_PORT'] ?? '587'),
  secure: process.env['MAIL_SECURE'] === 'true',
  auth: {
    user: process.env['MAIL_USER'],
    pass: process.env['MAIL_PASS'],
  },
}));
