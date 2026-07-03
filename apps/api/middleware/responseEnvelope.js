/**
 * @module middleware/responseEnvelope
 * @description Attaches `res.success()` and `res.fail()` helpers for the API envelope.
 */

import { ERROR_HTTP_STATUS } from "@prepedge/shared";

/**
 * @param {import("express").Request} _req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const responseEnvelopeMiddleware = (_req, res, next) => {
  /**
   * @template T
   * @param {T} data
   * @param {number} [statusCode=200]
   */
  res.success = (data, statusCode = 200) =>
    res.status(statusCode).json({ data, error: null });

  /**
   * @param {string} code
   * @param {string} message
   * @param {unknown} [details]
   */
  res.fail = (code, message, details) => {
    const status = ERROR_HTTP_STATUS[code] ?? 500;
    return res.status(status).json({
      data: null,
      error: {
        code,
        message,
        ...(details !== undefined && { details }),
      },
    });
  };

  next();
};
