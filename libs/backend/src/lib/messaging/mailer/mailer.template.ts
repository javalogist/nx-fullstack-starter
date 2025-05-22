import { MailerTemplate } from './mailer.interface';

export const EMAIL_TEMPLATES: Record<string, MailerTemplate> = {
  // Welcome email template
  welcome: {
    subject: 'Welcome to {{appName}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Welcome to {{appName}}!</h1>
        <p>Hello {{name}},</p>
        <p>Thank you for joining {{appName}}. We're excited to have you on board!</p>
        <p>Best regards,<br>The {{appName}} Team</p>
      </div>
    `,
  },

  // Email verification template
  verifyEmail: {
    subject: 'Verify your email address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Verify Your Email</h1>
        <p>Hello {{name}},</p>
        <p>Please click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{verificationLink}}" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Verify Email
          </a>
        </div>
        <p>If you didn't create an account, you can safely ignore this email.</p>
        <p>Best regards,<br>The {{appName}} Team</p>
      </div>
    `,
  },

  // Password reset template
  resetPassword: {
    subject: 'Reset your password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Reset Your Password</h1>
        <p>Hello {{name}},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{resetLink}}" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Reset Password
          </a>
        </div>
        <p>This link will expire in {{expiryTime}}.</p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <p>Best regards,<br>The {{appName}} Team</p>
      </div>
    `,
  },
}; 