import * as userService from "../services/userService.js";

export const getMe = async (req, res, next) => {
  try {
    const user = await userService.getUserByFirebaseId(req.firebaseUser.uid);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.firebaseUser.uid, req.validatedBody);
    res.json({ message: "Profile updated", user });
  } catch (err) {
    next(err);
  }
};
