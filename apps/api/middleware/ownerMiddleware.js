import mongoose from "mongoose";
import Interview from "../models/InterviewModel.js";
import User from "../models/UserModel.js";
import { AppError, ERROR_CODES } from "@prepedge/shared";

const isValidObjectId = (id) =>
  typeof id === "string" && id !== "undefined" && mongoose.Types.ObjectId.isValid(id);

export const requireInterviewOwner = async (req, res, next) => {
  try {
    const interviewId = req.params.id || req.params.interviewId;
    if (!isValidObjectId(interviewId)) {
      throw AppError.fromCode(ERROR_CODES.VALIDATION_ERROR, "Invalid interview ID");
    }

    const user = await User.findOne({ firebase_user_id: req.firebaseUser.uid });
    if (!user) throw AppError.fromCode(ERROR_CODES.NOT_FOUND, "User not found");

    const interview = await Interview.findById(interviewId);
    if (!interview) throw AppError.fromCode(ERROR_CODES.NOT_FOUND, "Interview not found");

    if (interview.user_id !== user._id.toString()) {
      throw AppError.fromCode(ERROR_CODES.FORBIDDEN, "Forbidden");
    }

    req.user = user;
    req.interview = interview;
    next();
  } catch (err) {
    next(err);
  }
};
