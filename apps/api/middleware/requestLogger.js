/**
 * @module middleware/requestLogger
 * @description Logs completed HTTP requests as structured JSON.
 */

import { log } from "../utils/logger.js";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const requestLoggerMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    log("info", "Request completed", {
      requestId: req.requestId,
      userId: req.firebaseUser?.uid ?? null,
      route: `${req.method} ${req.originalUrl || req.path}`,
      module: "http",
      durationMs: Date.now() - start,
      statusCode: res.statusCode,
    });
  });

  next();
};
