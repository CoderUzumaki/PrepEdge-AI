/**
 * @module controllers/healthController
 * @description Health check endpoint for uptime monitoring.
 */

const startTime = Date.now();

/**
 * GET /api/health
 * Liveness probe for Render and local dev.
 * @param {import("express").Request} _req
 * @param {import("express").Response} res
 */
export const healthCheck = (_req, res) => {
  res.success({
    status: "ok",
    uptime: Math.floor((Date.now() - startTime) / 1000),
    timestamp: new Date().toISOString(),
    version: "2.0.0",
  });
};
