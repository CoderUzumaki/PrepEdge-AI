/**
 * @module middleware/rateLimit
 * @description Rate limiters that return the standard API error envelope.
 */

import rateLimit from "express-rate-limit";
import { ERROR_CODES } from "@prepedge/shared";

/**
 * Creates an express-rate-limit middleware with `rate_limited` envelope responses.
 * @param {Object} options
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.max - Max requests per window per client
 * @param {string} options.message - User-visible message when limit is exceeded
 * @returns {import("express").RequestHandler}
 */
export const createRateLimiter = ({ windowMs, max, message }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.fail(ERROR_CODES.RATE_LIMITED, message);
    },
  });
