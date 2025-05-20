import { ConfigService } from '@nestjs/config';
import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';
import * as winstonMongoDB from 'winston-mongodb';
import * as winston from 'winston';

// 🎨 Define custom log colors (optional)
winston.addColors({
  info: 'green',
  warn: 'yellow',
  error: 'red',
  debug: 'blue',
  verbose: 'magenta',
});

@Injectable()
export class WinstonConfig implements LoggerService {
  private readonly logger: Logger;

  constructor(private configService: ConfigService) {
    const isProduction =
      this.configService.get<string>('NODE_ENV', 'development') ===
      'production';
    const mongoUri = this.configService.get<string>('MONGO_URI', '');
    const appName = this.configService.get<string>('APP_NAME', 'MyApp');

    const mongoTransports = isProduction
      ? [
          new winstonMongoDB.MongoDB({
            level: 'info',
            db: mongoUri,
            collection: 'app_logs',
            capped: true,
            cappedSize: 5242880,
          }),
          new winstonMongoDB.MongoDB({
            level: 'error',
            db: mongoUri,
            collection: 'error_logs',
            capped: true,
            cappedSize: 5242880,
          }),
        ]
      : [];

    // 🎨 Add colorized format
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.colorize({
          all: true, // Colorize all logs
        }),
        format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss a ' }),
        format.errors({ stack: true }),
        format.splat(),
        format.printf(({ timestamp, level, message, context }) => {
          return `[${appName}] - ${timestamp} ${level} [${context}]: ${message}`;
        })
      ),
      transports: [
        new transports.Console({
          level: isProduction ? 'info' : 'debug',
        }),
        ...mongoTransports,
      ],
    });
  }

  log(message: any, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: any, trace?: string, context?: string) {
    this.logger.error({
      message,
      trace: trace || new Error().stack,
      context,
    });
  }

  warn(message: any, context?: string) {
    this.logger.warn(message, { context });
  }

  debug?(message: any, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose?(message: any, context?: string) {
    this.logger.verbose(message, { context });
  }
}
