import * as userService from "../services/userService.js";

export const register = async (req, res, next) => {
  try {
    const user = await userService.findOrCreateUser(req.firebaseUser);
    res.status(200).json({ message: "Registration successful", user });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await userService.getUserByFirebaseId(req.firebaseUser.uid);
    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    next(err);
  }
};
