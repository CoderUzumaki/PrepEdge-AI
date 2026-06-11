import Report from "../models/ReportModel.js";
import Interview from "../models/InterviewModel.js";
import { AppError } from "../middleware/errorHandler.js";

export const getReportByInterviewId = async (interviewId, userId) => {
  const interview = await Interview.findById(interviewId);
  if (!interview) throw new AppError("Interview not found", 404);
  if (interview.user_id !== userId) throw new AppError("Forbidden", 403);

  const report = await Report.findOne({ interviewId });
  if (!report) throw new AppError("Report not found", 404);
  return report;
};

export const listUserReports = async (userId) =>
  Report.find({ userId })
    .populate("interviewId")
    .sort({ createdAt: -1 });
