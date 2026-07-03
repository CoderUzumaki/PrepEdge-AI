/**
 * @module services/userService
 * @description User profile lookup and updates backed by Firebase auth.
 */

import User from "../models/UserModel.js";
import { AppError, ERROR_CODES } from "@prepedge/shared";

/**
 * Finds an existing user or creates one from Firebase token claims.
 * @param {import("firebase-admin/auth").DecodedIdToken} firebaseUser
 * @returns {Promise<import("../models/UserModel.js").default>}
 */
export const findOrCreateUser = async (firebaseUser) => {
  let user = await User.findOne({ firebase_user_id: firebaseUser.uid });
  if (!user) {
    user = new User({
      firebase_user_id: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.name || "Anonymous",
    });
    await user.save();
  }
  return user;
};

/**
 * @param {string} uid - Firebase UID
 * @returns {Promise<import("../models/UserModel.js").default>}
 */
export const getUserByFirebaseId = async (uid) => {
  const user = await User.findOne({ firebase_user_id: uid });
  if (!user) throw AppError.fromCode(ERROR_CODES.NOT_FOUND, "User not found");
  return user;
};

/**
 * @param {string} uid - Firebase UID
 * @param {Object} updates - Partial profile fields
 * @returns {Promise<import("../models/UserModel.js").default>}
 */
export const updateUser = async (uid, updates) => {
  const user = await getUserByFirebaseId(uid);
  if (updates.name) user.name = updates.name;
  if (updates.preferences) {
    user.preferences = {
      ...(user.preferences?.toObject?.() ?? user.preferences ?? {}),
      ...updates.preferences,
    };
  }
  await user.save();
  return user;
};
