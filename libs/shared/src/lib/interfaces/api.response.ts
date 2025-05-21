/**
 * Generic API response wrapper for all 200 status responses.
 * Can represent both success and handled business logic failures.
 */
export interface ApiResponse<T = any> {
    /**
     * Indicates whether the operation was successful.
     * true  => data is present
     * false => a business rule was violated (e.g., user not verified)
     */
    success: boolean;
  
    /**
     * The payload, if the request was successful.
     */
    data?: T;
  
    /**
     * A human-readable message describing the outcome.
     */
    message?: string;
  
    /**
     * Optional domain-specific error code for frontend differentiation.
     * Only present when `success === false`.
     */
    errorCode?: string;
  }
  