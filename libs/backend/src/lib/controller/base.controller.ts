// base-controller.ts

import { ApiResponse } from '@kodevy-core-2.0/shared';

export abstract class BaseController {
  protected success<T>(data: T, message: string): ApiResponse<T> {
    const response = ApiResponse.success(data, message);
    // Secret tag to verify usage
    (response as any).__strictSuccess = true;
    return response;
  }
}
