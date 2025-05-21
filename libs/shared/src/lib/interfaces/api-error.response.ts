/**
 * Error response format for thrown HTTP exceptions (non-200).
 */
export interface ApiErrorResponse {
    /**
     * HTTP status code (e.g., 400, 401, 500)
     */
    statusCode: number;
  
    /**
     * A human-readable message describing the error.
     */
    message: string;
  
    /**
     * Optional domain-specific error code for frontend differentiation.
     */
    errorCode?: string;
  
    /**
     * The request path that caused the error.
     */
    path?: string;
  
    /**
     * ISO timestamp of when the error occurred.
     */
    timestamp: string;
  
    /**
     * Stack trace (included only in development).
     */
    stackTrace?: string;
  }
  