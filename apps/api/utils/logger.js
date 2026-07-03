/**
 * @module utils/logger
 * @description Structured JSON logger for Render stdout.
 */

/**
 * @param {"debug"|"info"|"warn"|"error"} level
 * @param {string} message
 * @param {Object} [meta] - requestId, userId, route, module, durationMs, statusCode
 */
export const log = (level, message, meta = {}) => {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };
  const fn = level === "error" ? console.error : console.log;
  fn(JSON.stringify(entry));
};
