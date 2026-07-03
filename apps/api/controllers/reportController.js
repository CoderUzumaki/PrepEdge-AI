/**
 * @module controllers/reportController
 * @description Report listing and retrieval for authenticated users.
 */

import mongoose from "mongoose";
import * as reportService from "../services/reportService.js";
import * as userService from "../services/userService.js";
import { AppError, ERROR_CODES } from "@prepedge/shared";

const isValidObjectId = (id) =>
  typeof id === "string" && id !== "undefined" && mongoose.Types.ObjectId.isValid(id);

/**
 * GET /api/reports
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const listReports = async (req, res, next) => {
  try {
    const user = await userService.getUserByFirebaseId(req.firebaseUser.uid);
    const reports = await reportService.listUserReports(user._id.toString());
    res.success(reports);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/reports/:interviewId
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const getReport = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.interviewId)) {
      throw AppError.fromCode(ERROR_CODES.VALIDATION_ERROR, "Invalid interview ID");
    }

    const user = await userService.getUserByFirebaseId(req.firebaseUser.uid);
    const report = await reportService.getReportByInterviewId(
      req.params.interviewId,
      user._id.toString()
    );
    res.success(report);
  } catch (err) {
    next(err);
  }
};
