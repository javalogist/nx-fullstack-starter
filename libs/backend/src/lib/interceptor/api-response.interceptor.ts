import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  import { ApiResponse } from '@kodevy-core-2.0/shared';
  
  @Injectable()
  export class ApiResponseInterceptor<T>
    implements NestInterceptor<T, ApiResponse<T>>
  {
    intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Observable<ApiResponse<T>> {
      return next.handle().pipe(
        map((data) => {
          // If it's already an ApiResponse-like object, avoid wrapping again
          if (
            data &&
            typeof data === 'object' &&
            'success' in data &&
            ('data' in data || 'message' in data)
          ) {
            return data;
          }
  
          const response: ApiResponse<T> = {
            success: true,
            data,
            message: 'Request successful',
          };
  
          return response;
        }),
      );
    }
  }
  