// global-exception.filter.ts
import { ApiErrorResponse } from '@kodevy-core-2.0/shared';
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
  } from '@nestjs/common';
  import { Response } from 'express';
  
  @Catch()
  export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = Logger;

  
    catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
  
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
  
      const message =
        exception instanceof HttpException
          ? exception.message
          : 'Internal server error';
  
      const res: ApiErrorResponse = {
        statusCode: status,
        message,
        errorCode: exception?.code || 'INTERNAL_ERROR',
        path: ctx.getRequest().url,
        timestamp: new Date().toISOString(),
        stackTrace: process.env['NODE_ENV'] !== 'production' ? exception.stack : undefined,
      };
  
      this.logger.error(res.message, res.stackTrace, 'GlobalExceptionFilter');
  
      response.status(status).json(res);
    }
  }
  