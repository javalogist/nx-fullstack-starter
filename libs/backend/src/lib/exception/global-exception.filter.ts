// global-exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '@kodevy-core-2.0/shared';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = Logger;

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = (exception.status || exception.statusCode || HttpStatus.INTERNAL_SERVER_ERROR);

    const message = exception.response?.message || exception.message || 'Internal server error';

    const res = ApiResponse.error(
      message,
      status,
      exception?.code || 'INTERNAL_ERROR',
      ctx.getRequest().url,
      exception.stack
    );

    this.logger.error(res.message, res.stackTrace, 'GlobalExceptionFilter');

    response.status(status).json(res);
  }
}
