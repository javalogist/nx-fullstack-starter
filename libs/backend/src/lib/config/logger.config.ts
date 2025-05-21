import { ConfigService } from '@nestjs/config';
import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';
import * as winstonMongoDB from 'winston-mongodb';
import * as winston from 'winston';

winston.addColors({
  info: 'green',
  warn: 'yellow',
  error: 'red',
  debug: 'blue',
  verbose: 'magenta',
});

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private readonly logger: Logger;

  constructor(private configService: ConfigService) {
    const isProduction =
      this.configService.get<string>('NODE_ENV', 'development') === 'production';
    const mongoUri = this.configService.get<string>('MONGO_URI', '');
    const appName = this.configService.get<string>('APP_NAME', 'MyApp');

    const transportsArray: winston.transport[] = [];

    if (isProduction) {
      transportsArray.push(
        new winstonMongoDB.MongoDB({
          level: 'info', // includes warn + error
          db: mongoUri,
          collection: 'app_logs',
          tryReconnect: true,
          capped: true,
          cappedSize: 5 * 1024 * 1024, // ~5MB
        }),
        new winstonMongoDB.MongoDB({
          level: 'error',
          db: mongoUri,
          collection: 'error_logs',
          tryReconnect: true,
          capped: true,
          cappedSize: 5 * 1024 * 1024,
        }),
      );
    } else {
      transportsArray.push(
        new transports.Console({
          level: 'debug',
          format: format.combine(format.colorize()),
        }),
      );
    }

    this.logger = createLogger({
      level: isProduction ? 'info' : 'debug',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss a' }),
        format.errors({ stack: true }),
        format.splat(),
        format.printf(({ timestamp, level, message, context, stack }) => {
          const ctx = context || 'App';
          const baseLog = `[${appName}] - ${timestamp} ${level} [${ctx}]: ${message}`;
          return stack ? `${baseLog}\nStack: ${stack}` : baseLog;
        }),
      ),
      transports: transportsArray,
    });
  }

  log(message: any, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: any, trace?: string, context?: string) {
    this.logger.error({
      message,
      stack: trace || new Error().stack,
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
