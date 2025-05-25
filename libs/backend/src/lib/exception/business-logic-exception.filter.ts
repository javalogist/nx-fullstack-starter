// business-exception.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { BusinessLogicException } from './business-logic.exception';
import { Response } from 'express';
import { ApiResponse } from '@kodevy-core-2.0/shared';

@Catch(BusinessLogicException)
export class BusinessLogicExceptionFilter implements ExceptionFilter {
  private readonly logger = Logger;

  catch(exception: BusinessLogicException, host: ArgumentsHost) {
    console.log('catched in  BusinessLogicExceptionFilter');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const res = ApiResponse.fail(exception.message, exception.errorCode);

    //only in development mode
    this.logger.warn(`[BusinessLogicException]: ${exception.message}`, 'BusinessLogicExceptionFilter');

    response.status(200).json(res);
  }
}
