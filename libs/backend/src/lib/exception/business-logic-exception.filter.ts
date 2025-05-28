// business-exception.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { BusinessLogicException } from './business-logic.exception';
import { FastifyReply } from 'fastify';
import { ApiResponse } from '@kodevy-core-2.0/shared';

@Catch(BusinessLogicException)
export class BusinessLogicExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(BusinessLogicExceptionFilter.name);

  catch(exception: BusinessLogicException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    const res = ApiResponse.fail(exception.message, exception.errorCode);

    //only in development mode
    this.logger.warn(`[BusinessLogicException]: ${exception.message}`);

    response.status(200).send(res);
  }
}
