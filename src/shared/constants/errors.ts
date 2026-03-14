export const ERROR_CODES = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  CONFLICT: "CONFLICT",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  RATE_LIMITED: "RATE_LIMITED",
} as const;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Authentication required",
  FORBIDDEN: "Insufficient permissions",
  NOT_FOUND: "Resource not found",
  VALIDATION_ERROR: "Validation failed",
  CONFLICT: "Resource already exists",
  INTERNAL_ERROR: "An unexpected error occurred",
  RATE_LIMITED: "Too many requests, please try again later",
  INVALID_CREDENTIALS: "Invalid email or password",
  TOKEN_EXPIRED: "Session expired, please log in again",
} as const;
