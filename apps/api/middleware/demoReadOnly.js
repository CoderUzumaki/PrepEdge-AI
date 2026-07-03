/**
 * @module middleware/demoReadOnly
 * @description Blocks write operations for read-only demo accounts.
 */

import * as userService from "../services/userService.js";
import { AppError, ERROR_CODES } from "@prepedge/shared";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const blockDemoWrites = async (req, res, next) => {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    return next();
  }

  try {
    const user = await userService.getUserByFirebaseId(req.firebaseUser.uid);
    if (user.is_demo) {
      throw AppError.fromCode(
        ERROR_CODES.FORBIDDEN,
        "Demo account is read-only. Sign up for free to create your own interviews."
      );
    }
    next();
  } catch (err) {
    next(err);
  }
};
