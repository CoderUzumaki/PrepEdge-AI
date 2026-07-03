/**
 * @module controllers/userController
 * @description Authenticated user profile endpoints.
 */

import * as userService from "../services/userService.js";
import * as quotaService from "../services/quotaService.js";

/**
 * GET /api/users/me
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await userService.getUserByFirebaseId(req.firebaseUser.uid);
    res.success(user);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/users/me
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const updateMe = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.firebaseUser.uid, req.validatedBody);
    res.success({ message: "Profile updated", user });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/me/quotas
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const getMyQuotas = async (req, res, next) => {
  try {
    const user = await userService.getUserByFirebaseId(req.firebaseUser.uid);
    const quotas = quotaService.getQuotaStatus(user);
    await user.save();
    res.success(quotas);
  } catch (err) {
    next(err);
  }
};
