import mongoose from "mongoose";
import * as reportService from "../services/reportService.js";
import * as userService from "../services/userService.js";
import { AppError } from "../middleware/errorHandler.js";

const isValidObjectId = (id) =>
  typeof id === "string" && id !== "undefined" && mongoose.Types.ObjectId.isValid(id);

export const listReports = async (req, res, next) => {
  try {
    const user = await userService.getUserByFirebaseId(req.firebaseUser.uid);
    const reports = await reportService.listUserReports(user._id.toString());
    res.json(reports);
  } catch (err) {
    next(err);
  }
};

export const getReport = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.interviewId)) {
      throw new AppError("Invalid interview ID", 400);
    }

    const user = await userService.getUserByFirebaseId(req.firebaseUser.uid);
    const report = await reportService.getReportByInterviewId(
      req.params.interviewId,
      user._id.toString()
    );
    res.json(report);
  } catch (err) {
    next(err);
  }
};
