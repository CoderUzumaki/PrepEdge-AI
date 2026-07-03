/**
 * @module errors/codes
 * @description Stable API error codes and HTTP status mappings.
 */

export const ERROR_CODES = {
  UNAUTHORIZED: "unauthorized",
  FORBIDDEN: "forbidden",
  NOT_FOUND: "not_found",
  VALIDATION_ERROR: "validation_error",
  RATE_LIMITED: "rate_limited",
  GUARDRAIL_VIOLATION: "guardrail_violation",
  UPSTREAM_FAILURE: "upstream_failure",
  INTERNAL_ERROR: "internal_error",
};

/** @type {Record<string, number>} */
export const ERROR_HTTP_STATUS = {
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  validation_error: 400,
  rate_limited: 429,
  guardrail_violation: 422,
  upstream_failure: 502,
  internal_error: 500,
};
