/**
 * @module controllers/reportController
 * @description Report listing, retrieval, and sharing for authenticated users.
 */

import mongoose from "mongoose";
import * as reportService from "../services/reportService.js";
import * as userService from "../services/userService.js";
import { AppError, ERROR_CODES } from "@prepedge/shared";

const isValidObjectId = (id) =>
  typeof id === "string" && id !== "undefined" && mongoose.Types.ObjectId.isValid(id);

/**
 * GET /api/reports
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

/**
 * GET /api/reports/public/:token
 */
export const getPublicReport = async (req, res, next) => {
  try {
    const report = await reportService.getPublicReportByToken(req.params.token);
    res.success(report);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/reports/:interviewId/share
 */
export const enableShare = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.interviewId)) {
      throw AppError.fromCode(ERROR_CODES.VALIDATION_ERROR, "Invalid interview ID");
    }

    const user = await userService.getUserByFirebaseId(req.firebaseUser.uid);
    const report = await reportService.enableReportShare(
      req.params.interviewId,
      user._id.toString()
    );

    res.success({
      shareToken: report.shareToken,
      shareExpiresAt: report.shareExpiresAt,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/reports/:interviewId/share
 */
export const disableShare = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.interviewId)) {
      throw AppError.fromCode(ERROR_CODES.VALIDATION_ERROR, "Invalid interview ID");
    }

    const user = await userService.getUserByFirebaseId(req.firebaseUser.uid);
    await reportService.disableReportShare(req.params.interviewId, user._id.toString());
    res.success({ message: "Share link revoked" });
  } catch (err) {
    next(err);
  }
};
