export class ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T | null;
  errorCode?: string;
  statusCode?: number;
  path?: string;
  timestamp: string;
  stackTrace?: string;

  private constructor(init: Partial<ApiResponse<T>>) {
    Object.assign(this, init);
    this.success = init.success ?? false;
    this.message = init.message ?? '';
    this.timestamp = init.timestamp ?? new Date().toISOString();
  }

  static success<T>(data: T, message = 'Request successful'): ApiResponse<T> {
    return new ApiResponse<T>({
      success: true,
      data,
      message,
    });
  }

  static fail<T = undefined>(
    message: string,
    errorCode?: string
  ): ApiResponse<T> {
    return new ApiResponse<T>({
      success: false,
      message,
      errorCode,
      data: null,
    });
  }

  static error<T = undefined>(
    message: string,
    statusCode: number,
    errorCode?: string,
    path?: string,
    stackTrace?: string
  ): ApiResponse<T> {
    return new ApiResponse<T>({
      success: false,
      message,
      statusCode,
      errorCode,
      path,
      stackTrace,
      data: null,
    });
  }

  static fromHttpError(err: any): ApiResponse<null> {
    return ApiResponse.error(
      err?.message || 'Unknown error occurred',
      err?.statusCode || 500,
      err?.errorCode,
      err?.path,
      err?.stackTrace
    );
  }

  static isApiResponse(obj: any): obj is ApiResponse<any> {
    return obj && typeof obj.success === 'boolean' && 'message' in obj;
  }
}
