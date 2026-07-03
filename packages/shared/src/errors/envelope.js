/**
 * @module errors/envelope
 * @description AppError class and response envelope helpers.
 */

import { ERROR_HTTP_STATUS } from "./codes.js";

/**
 * Application error with a stable machine-readable code.
 */
export class AppError extends Error {
  /**
   * @param {string} code - Stable error code (see ERROR_CODES)
   * @param {string} message - Human-readable error message
   * @param {unknown} [details] - Optional structured details
   */
  constructor(code, message, details) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.details = details;
  }

  /** @returns {number} HTTP status for this error code */
  get httpStatus() {
    return ERROR_HTTP_STATUS[this.code] ?? 500;
  }

  /**
   * @param {string} code
   * @param {string} message
   * @param {unknown} [details]
   * @returns {AppError}
   */
  static fromCode(code, message, details) {
    return new AppError(code, message, details);
  }

  /**
   * Maps a legacy HTTP status code to a stable error code.
   * @param {number} statusCode
   * @param {string} message
   * @param {unknown} [details]
   * @returns {AppError}
   */
  static fromStatus(statusCode, message, details) {
    /** @type {Record<number, string>} */
    const statusToCode = {
      400: "validation_error",
      401: "unauthorized",
      403: "forbidden",
      404: "not_found",
      422: "guardrail_violation",
      429: "rate_limited",
      500: "internal_error",
      502: "upstream_failure",
      503: "upstream_failure",
    };
    const code = statusToCode[statusCode] ?? "internal_error";
    return new AppError(code, message, details);
  }
}

/**
 * Builds a success envelope payload.
 * @template T
 * @param {T} data
 * @returns {{ data: T, error: null }}
 */
export const successEnvelope = (data) => ({ data, error: null });

/**
 * Builds a failure envelope payload.
 * @param {string} code
 * @param {string} message
 * @param {unknown} [details]
 * @returns {{ data: null, error: { code: string, message: string, details?: unknown } }}
 */
export const failEnvelope = (code, message, details) => ({
  data: null,
  error: {
    code,
    message,
    ...(details !== undefined && { details }),
  },
});
