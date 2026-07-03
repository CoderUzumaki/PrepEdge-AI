/**
 * @module middleware/validate
 * @description Zod validation middleware for request body and query.
 */

import { ERROR_CODES } from "@prepedge/shared";

/**
 * Zod validation middleware. Attaches parsed data to req.validatedBody or req.validatedQuery.
 * @param {import("zod").ZodSchema} schema
 * @param {"body"|"query"} [source="body"]
 */
export const validate = (schema, source = "body") => (req, res, next) => {
  const data = source === "query" ? req.query : req.body;
  const result = schema.safeParse(data);

  if (!result.success) {
    return res.fail(
      ERROR_CODES.VALIDATION_ERROR,
      "Validation failed",
      result.error.flatten().fieldErrors
    );
  }

  if (source === "query") {
    req.validatedQuery = result.data;
  } else {
    req.validatedBody = result.data;
  }
  next();
};
