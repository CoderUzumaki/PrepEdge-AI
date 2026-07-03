/**
 * @module services/reportService
 * @description Report retrieval, sharing, and ownership checks.
 */

import crypto from "crypto";
import Report from "../models/ReportModel.js";
import Interview from "../models/InterviewModel.js";
import { AppError, ERROR_CODES } from "@prepedge/shared";

const SHARE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

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

/**
 * @param {import("../models/ReportModel.js").default} report
 */
export const sanitizePublicReport = (report, interview) => ({
  interviewName: interview?.interview_name ?? "Interview",
  finalScore: report.finalScore ?? null,
  summary: report.summary ?? null,
  strengths: report.strengths ?? null,
  areaOfImprovement: report.areaOfImprovement ?? null,
  createdAt: report.createdAt,
  shareExpiresAt: report.shareExpiresAt,
  answers: (report.answers || []).map((a) => ({
    question: a.question,
    userAnswer: a.userAnswer,
    preferredAnswer: a.preferredAnswer,
    score: a.score ?? null,
    feedback: a.feedback ?? null,
    tags: a.tags ?? [],
    speechMetrics: a.speechMetrics ?? null,
  })),
});

/**
 * @param {string} token
 */
export const getPublicReportByToken = async (token) => {
  const report = await Report.findOne({ shareToken: token });
  if (!report) {
    throw AppError.fromCode(ERROR_CODES.NOT_FOUND, "Shared report not found");
  }
  if (!report.shareExpiresAt || report.shareExpiresAt <= new Date()) {
    throw AppError.fromCode(ERROR_CODES.NOT_FOUND, "This share link has expired");
  }

  const interview = await Interview.findById(report.interviewId).select("interview_name");
  return sanitizePublicReport(report, interview);
};

/**
 * @param {string} interviewId
 * @param {string} userId
 */
export const enableReportShare = async (interviewId, userId) => {
  const report = await getReportByInterviewId(interviewId, userId);
  report.shareToken = crypto.randomUUID();
  report.shareExpiresAt = new Date(Date.now() + SHARE_TTL_MS);
  await report.save();
  return report;
};

/**
 * @param {string} interviewId
 * @param {string} userId
 */
export const disableReportShare = async (interviewId, userId) => {
  const report = await getReportByInterviewId(interviewId, userId);
  report.shareToken = null;
  report.shareExpiresAt = null;
  await report.save();
  return report;
};
