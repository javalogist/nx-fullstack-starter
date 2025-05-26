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
            data && ApiResponse.isApiResponse(data)
          ) {
            return data;
          }

          return ApiResponse.success(
            data.data ?? data,
             data.message ?? 'Request successful');
          }),
      );
    }
  }
  