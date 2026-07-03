/**
 * @module middleware/errorHandler
 * @description Global 404 and error handlers using the API response envelope.
 */

import { AppError, ERROR_CODES } from "@prepedge/shared";
import { log } from "../utils/logger.js";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const notFoundHandler = (req, res) => {
  res.fail(ERROR_CODES.NOT_FOUND, `Route not found: ${req.method} ${req.path}`);
};

/**
 * @param {Error} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} _next
 */
export const errorHandler = (err, req, res, _next) => {
  const route = `${req.method} ${req.originalUrl || req.path}`;
  const meta = {
    requestId: req.requestId,
    userId: req.firebaseUser?.uid ?? null,
    route,
    module: "errorHandler",
  };

  if (err instanceof AppError) {
    log("warn", err.message, { ...meta, statusCode: err.httpStatus });
    return res.fail(err.code, err.message, err.details);
  }

  if (err.name === "ValidationError") {
    log("warn", err.message, { ...meta, statusCode: 400 });
    return res.fail(ERROR_CODES.VALIDATION_ERROR, err.message);
  }

  // Legacy AppError shape (statusCode on error object)
  if (err.statusCode && typeof err.statusCode === "number") {
    const appErr = AppError.fromStatus(err.statusCode, err.message);
    log("warn", err.message, { ...meta, statusCode: appErr.httpStatus });
    return res.fail(appErr.code, appErr.message, err.details);
  }

  log("error", err.message || "Internal server error", meta);
  res.fail(ERROR_CODES.INTERNAL_ERROR, "Internal server error");
};
