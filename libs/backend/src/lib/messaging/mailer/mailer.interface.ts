export interface MailerConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface MailerOptions {
  to: string | string[];
  subject: string;
  template: string;
  data?: Record<string, any>;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export interface MailerResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface MailerTemplate {
  subject: string;
  html: string;
  text?: string;
} 