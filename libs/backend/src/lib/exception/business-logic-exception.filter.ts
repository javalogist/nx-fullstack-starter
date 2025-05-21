// business-exception.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { BusinessLogicException } from './business-logic.exception';
import { Response } from 'express';
import { ApiErrorResponse, ApiResponse } from '@kodevy-core-2.0/shared';

@Catch(BusinessLogicException)
export class BusinessLogicExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: BusinessLogicException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const res: ApiResponse = {
      success: false,
      data: null,
      message: exception.message,
      errorCode: exception.errorCode,
    };

    //only in development mode
    this.logger.warn(`[BusinessLogicException]: ${exception.message}`, 'BusinessLogicExceptionFilter');

    response.status(200).json(res);
  }
}
