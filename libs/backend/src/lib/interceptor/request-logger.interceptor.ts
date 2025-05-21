import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable, tap } from 'rxjs';
  
  @Injectable()
  export class RequestLoggerInterceptor implements NestInterceptor {
    private readonly logger = Logger;
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const now = Date.now();
      const request = context.switchToHttp().getRequest();
      const { method, originalUrl, body, query, params } = request;
  
      return next.handle().pipe(
        tap(() => {
          if (process.env['NODE_ENV'] !== 'production') {
            this.logger.debug(
              `${method} ${originalUrl} - ${Date.now() - now}ms`,
              JSON.stringify({ query, params, body }),
              'RequestLogger',
            );
          }
        }),
      );
    }
  }
  