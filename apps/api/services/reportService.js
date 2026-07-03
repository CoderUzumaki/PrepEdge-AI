/**
 * @module services/reportService
 * @description Report retrieval with ownership checks.
 */

import Report from "../models/ReportModel.js";
import Interview from "../models/InterviewModel.js";
import { AppError, ERROR_CODES } from "@prepedge/shared";

/**
 * @param {string} interviewId
 * @param {string} userId - MongoDB user ID
 * @returns {Promise<import("../models/ReportModel.js").default>}
 */
export const getReportByInterviewId = async (interviewId, userId) => {
  const interview = await Interview.findById(interviewId);
  if (!interview) throw AppError.fromCode(ERROR_CODES.NOT_FOUND, "Interview not found");
  if (interview.user_id !== userId) throw AppError.fromCode(ERROR_CODES.FORBIDDEN, "Forbidden");

  const report = await Report.findOne({ interviewId });
  if (!report) throw AppError.fromCode(ERROR_CODES.NOT_FOUND, "Report not found");
  return report;
};

/**
 * @param {string} userId - MongoDB user ID
 * @returns {Promise<import("../models/ReportModel.js").default[]>}
 */
export const listUserReports = async (userId) =>
  Report.find({ userId })
    .populate("interviewId")
    .sort({ createdAt: -1 });
