import { ApiResponse } from "./api.response";
import { ApiErrorResponse } from "./api-error.response";

export type ApiResult<T = any> = ApiResponse<T> | ApiErrorResponse;
