/**
 * @module controllers/authController
 * @description Firebase-authenticated registration and login sync endpoints.
 */

import * as userService from "../services/userService.js";

/**
 * POST /api/auth/register
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const register = async (req, res, next) => {
  try {
    const user = await userService.findOrCreateUser(req.firebaseUser);
    res.success({ message: "Registration successful", user });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const login = async (req, res, next) => {
  try {
    const user = await userService.getUserByFirebaseId(req.firebaseUser.uid);
    res.success({ message: "Login successful", user });
  } catch (err) {
    next(err);
  }
};
