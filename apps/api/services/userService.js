import User from "../models/UserModel.js";
import { AppError } from "../middleware/errorHandler.js";

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

export const getUserByFirebaseId = async (uid) => {
  const user = await User.findOne({ firebase_user_id: uid });
  if (!user) throw new AppError("User not found", 404);
  return user;
};

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
