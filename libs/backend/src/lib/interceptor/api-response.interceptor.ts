import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '@kodevy-core-2.0/shared';
import { BaseController } from '../controller';

@Injectable()
export class ApiResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {

    const controllerClass = context.getClass();

    // Check inheritance
    if (!this.extendsBaseController(controllerClass)) {
      throw new BadRequestException(
        `Controller "${controllerClass.name}" must extend BaseController to use strict API response formatting.`,
      );
    }

    return next.handle().pipe(
      map((data) => {
        // Validate the response is the "success" wrapped response
        if (
          typeof data !== 'object' ||
          data === null ||
          !('__strictSuccess' in data)
        ) {
          throw new BadRequestException(
            `Controller "${controllerClass.name}" must use this.success(...) method to return the API response.`,
          );
        }

        // Extra safety: verify the shape
        if (
          !('data' in data) ||
          !('message' in data) ||
          typeof data.message !== 'string'
        ) {
          throw new BadRequestException(
            `Controller "${controllerClass.name}" must return { data, message } in the response.`,
          );
        }

        return ApiResponse.success(
          data.data ?? data,
          data.message ?? 'Request successful');

      }),
    );
  }

  private extendsBaseController(target: Function): boolean {
    return BaseController.prototype.isPrototypeOf(target.prototype);
  }
}
