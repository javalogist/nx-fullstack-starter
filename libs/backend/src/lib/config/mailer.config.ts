// src/config/mailer.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('mailer', () => ({
  host: process.env['MAILER_HOST'],
  port: parseInt(process.env['MAILER_PORT'] ?? '587'),
  secure: process.env['MAILER_SECURE'] === 'true',
  auth: {
    user: process.env['MAILER_USER'],
    pass: process.env['MAILER_PASS'],
  },
}));
