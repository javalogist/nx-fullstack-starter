import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';

@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
  private readonly logger =  new Logger(RequestLoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl, body, query, params } = request;

    this.logger.log(
      `Incoming Request: ${method} ${originalUrl} ==> ${JSON.stringify({ query, params, body })}`
    );

    return next.handle().pipe(
      tap((responseData) => {
        const duration = Date.now() - now;
        this.logger.log(
          `Completed Response: ${method} ${originalUrl} - ${duration}ms ==> ${JSON.stringify(responseData)}`
        );
      })
    );
  }
}
