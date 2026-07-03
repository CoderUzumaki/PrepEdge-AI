/**
 * @module services/userService
 * @description User profile lookup and updates backed by Firebase auth.
 */

import User from "../models/UserModel.js";
import Interview from "../models/InterviewModel.js";
import Report from "../models/ReportModel.js";
import InterviewTemplate from "../models/InterviewTemplateModel.js";
import admin from "../config/firebase.js";
import { deleteCloudinaryFile } from "../utils/cloudinaryDelete.js";
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

/**
 * Permanently deletes the user and all associated data.
 * @param {string} firebaseUid - Firebase UID
 */
export const deleteUserAccount = async (firebaseUid) => {
  const user = await getUserByFirebaseId(firebaseUid);
  const mongoUserId = user._id.toString();

  const interviews = await Interview.find({ user_id: mongoUserId });
  for (const interview of interviews) {
    if (interview.resume_link) {
      await deleteCloudinaryFile(interview.resume_link);
    }
  }

  await Promise.all([
    Report.deleteMany({ userId: mongoUserId }),
    Interview.deleteMany({ user_id: mongoUserId }),
    InterviewTemplate.deleteMany({ user_id: mongoUserId, is_system: false }),
    User.deleteOne({ _id: user._id }),
  ]);

  await admin.auth().deleteUser(firebaseUid);
};
