/**
 * @module lib/api/errors
 * @description ApiError class and helpers for the frontend API client.
 */

/** Maps HTTP status codes to stable API error codes when the body lacks a code. */
const STATUS_TO_CODE = {
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

/**
 * @param {number} [status]
 * @returns {string}
 */
const codeFromStatus = (status) =>
  (status && STATUS_TO_CODE[status]) || "internal_error";

/**
 * Normalizes assorted API/legacy error body shapes into { code, message, details? }.
 * @param {unknown} body
 * @param {number} [status]
 * @returns {{ code: string, message: string, details?: unknown }}
 */
export const normalizeApiError = (body, status) => {
  if (body && typeof body === "object" && body.error != null) {
    const errField = body.error;

    if (typeof errField === "object" && errField.message) {
      return {
        code: errField.code || codeFromStatus(status),
        message: errField.message,
        ...(errField.details !== undefined && { details: errField.details }),
      };
    }

    if (typeof errField === "string") {
      return {
        code: codeFromStatus(status),
        message: errField,
      };
    }
  }

  if (body && typeof body === "object" && typeof body.message === "string") {
    return {
      code: codeFromStatus(status),
      message: body.message,
      ...(body.details !== undefined && { details: body.details }),
    };
  }

  if (typeof body === "string" && body.trim()) {
    return {
      code: codeFromStatus(status),
      message: body.slice(0, 200),
    };
  }

  return {
    code: codeFromStatus(status),
    message: "Request failed",
  };
};

/**
 * Error thrown when the API returns a failure envelope or the request fails.
 */
export class ApiError extends Error {
  /**
   * @param {{ code: string, message: string, details?: unknown }} error
   * @param {number} [status]
   */
  constructor(error, status) {
    super(error.message);
    this.name = "ApiError";
    this.code = error.code;
    this.details = error.details;
    this.status = status;
  }

  /**
   * @param {import("axios").AxiosError} axiosError
   * @returns {ApiError}
   */
  static fromAxios(axiosError) {
    const status = axiosError.response?.status;
    const body = axiosError.response?.data;

    if (body != null) {
      return new ApiError(normalizeApiError(body, status), status);
    }

    return new ApiError(
      {
        code: "internal_error",
        message: axiosError.message || "Network request failed",
      },
      status
    );
  }
}

/**
 * Formats Zod-style field error maps into a single readable string.
 * @param {unknown} details
 * @returns {string | null}
 */
export const formatValidationDetails = (details) => {
  if (!details || typeof details !== "object") return null;

  const messages = [];
  for (const [field, errors] of Object.entries(details)) {
    const fieldErrors = Array.isArray(errors) ? errors : [errors];
    fieldErrors.forEach((entry) => {
      if (entry) messages.push(`${field}: ${entry}`);
    });
  }

  return messages.length > 0 ? messages.join("; ") : null;
};

/**
 * Extracts a user-visible message from an API or network error.
 * @param {unknown} err
 * @param {string} [fallback="Something went wrong"]
 * @returns {string}
 */
export const getErrorMessage = (err, fallback = "Something went wrong") => {
  if (err instanceof ApiError) {
    if (err.code === "validation_error" && err.details) {
      const detailText = formatValidationDetails(err.details);
      if (detailText) return `${err.message}: ${detailText}`;
    }

    if (err.code === "rate_limited") {
      return err.message || "You've hit a usage limit. Please try again later.";
    }

    return err.message || fallback;
  }

  if (err instanceof Error && err.message) return err.message;
  return fallback;
};
