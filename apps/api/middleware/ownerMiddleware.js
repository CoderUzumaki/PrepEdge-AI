import mongoose from "mongoose";
import Interview from "../models/InterviewModel.js";
import User from "../models/UserModel.js";
import { AppError } from "./errorHandler.js";

const isValidObjectId = (id) =>
  typeof id === "string" && id !== "undefined" && mongoose.Types.ObjectId.isValid(id);

export const requireInterviewOwner = async (req, res, next) => {
  try {
    const interviewId = req.params.id || req.params.interviewId;
    if (!isValidObjectId(interviewId)) {
      throw new AppError("Invalid interview ID", 400);
    }

    const user = await User.findOne({ firebase_user_id: req.firebaseUser.uid });
    if (!user) throw new AppError("User not found", 404);

    const interview = await Interview.findById(interviewId);
    if (!interview) throw new AppError("Interview not found", 404);

    if (interview.user_id !== user._id.toString()) {
      throw new AppError("Forbidden", 403);
    }

    req.user = user;
    req.interview = interview;
    next();
  } catch (err) {
    next(err);
  }
};
