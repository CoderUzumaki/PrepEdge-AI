/**
 * @module middleware/requestId
 * @description Assigns a UUID correlation ID to every HTTP request.
 */

import { randomUUID } from "node:crypto";

/**
 * Attaches `req.requestId` and sets the `X-Request-Id` response header.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const requestIdMiddleware = (req, res, next) => {
  const requestId = randomUUID();
  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);
  next();
};
