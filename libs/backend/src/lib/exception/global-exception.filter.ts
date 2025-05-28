// global-exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ApiResponse } from '@kodevy-core-2.0/shared';
import { BusinessLogicException } from './business-logic.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_ERROR';
    let stack = exception.stack;

    if (exception instanceof BusinessLogicException) {
      status = 200; // Business logic errors return 200
      message = exception.message;
      errorCode = exception.errorCode;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'object' && res !== null) {
        message = (res as any).message || message;
      } else if (typeof res === 'string') {
        message = res;
      }
    } else if (exception.response?.message) {
      message = exception.response.message;
    } else if (exception.message) {
      message = exception.message;
    }

    const apiError = ApiResponse.error(
      message,
      status,
      errorCode,
      request?.url,
      stack
    );

    this.logger.error(`Error Response: ${request?.method} ${request?.url} --${message} -- [${status}]`,
      JSON.stringify(apiError),
    );

    response.status(status).send(apiError);
  }
}
