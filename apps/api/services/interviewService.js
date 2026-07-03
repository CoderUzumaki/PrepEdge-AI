/**
 * @module services/interviewService
 * @description Business logic for interview lifecycle: setup, answers, scoring, analytics.
 */

import Interview from "../models/InterviewModel.js";
import Report from "../models/ReportModel.js";
import {
  generateQuestions,
  analyzeAnswer,
  generateInterviewSummary,
  generatePracticeQuestion,
} from "../providers/ai/index.js";
import { AppError, ERROR_CODES } from "@prepedge/shared";
import { log } from "../utils/logger.js";

/**
 * Creates an interview and kicks off async question generation.
 * @param {string} userId - MongoDB user ID
 * @param {Object} data - Validated interview setup payload
 * @param {string|null} resumeLink - Cloudinary URL if uploaded
 * @param {string|null} resumeSummary - Parsed resume summary
 * @param {string|null} [requestId] - Correlation ID from HTTP middleware
 * @returns {Promise<import("../models/InterviewModel.js").default>}
 */
export const createInterview = async (userId, data, resumeLink, resumeSummary, requestId = null) => {
  const interview = new Interview({
    user_id: userId,
    interview_name: data.interviewName,
    num_of_questions: data.numOfQuestions,
    interview_type: data.interviewType,
    role: data.role,
    experience_level: data.experienceLevel,
    company_name: data.companyName,
    company_description: data.companyDescription,
    job_description: data.jobDescription,
    focus_area: data.focusAt,
    resume_link: resumeLink,
    resume_summary: resumeSummary,
    status: "generating",
    questions: [],
  });
  await interview.save();

  generateQuestionsAsync(interview._id.toString(), requestId);
  return interview;
};

/**
 * @param {string} interviewId
 * @param {string|null} [requestId]
 */
const generateQuestionsAsync = async (interviewId, requestId = null) => {
  const start = Date.now();
  const meta = {
    requestId,
    module: "interviewService",
    route: "async/generateQuestions",
  };

  try {
    const interview = await Interview.findById(interviewId);
    if (!interview) return;

    const questions = await generateQuestions({
      num_of_questions: interview.num_of_questions,
      interview_type: interview.interview_type,
      role: interview.role,
      experience_level: interview.experience_level,
      company_name: interview.company_name,
      company_description: interview.company_description,
      job_description: interview.job_description,
      focus_area: interview.focus_area,
      resume_summary: interview.resume_summary,
    });

    interview.questions = questions;
    interview.status = "ready";
    await interview.save();

    log("info", "Questions generated", {
      ...meta,
      durationMs: Date.now() - start,
      statusCode: 200,
    });
  } catch (err) {
    log("error", "Question generation failed", {
      ...meta,
      durationMs: Date.now() - start,
      errorDetail: err.message,
    });
    await Interview.findByIdAndUpdate(interviewId, { status: "draft" });
  }
};

/**
 * Creates a single-question practice interview.
 * @param {string} userId
 * @param {Object} data - Validated practice payload
 * @returns {Promise<import("../models/InterviewModel.js").default>}
 */
export const createPracticeInterview = async (userId, data) => {
  const question = await generatePracticeQuestion({
    role: data.role,
    experienceLevel: data.experienceLevel,
    interviewType: data.interviewType,
    topic: data.topic,
  });

  if (!question) {
    throw AppError.fromCode(ERROR_CODES.INTERNAL_ERROR, "Failed to generate practice question");
  }

  const interview = new Interview({
    user_id: userId,
    interview_name: `Practice: ${data.topic || data.role}`,
    num_of_questions: 1,
    interview_type: data.interviewType,
    role: data.role,
    experience_level: data.experienceLevel,
    status: "ready",
    is_practice: true,
    questions: [question],
  });
  await interview.save();
  return interview;
};

/**
 * @param {string} id
 * @returns {Promise<import("../models/InterviewModel.js").default>}
 */
export const getInterviewById = async (id) => {
  const interview = await Interview.findById(id);
  if (!interview) throw AppError.fromCode(ERROR_CODES.NOT_FOUND, "Interview not found");
  return interview;
};

/**
 * @param {string} userId
 * @returns {Promise<import("../models/InterviewModel.js").default[]>}
 */
export const listUserInterviews = async (userId) =>
  Interview.find({ user_id: userId }).sort({ created_at: -1 });

/**
 * @param {import("../models/InterviewModel.js").default} interview
 * @param {Object} updates
 * @returns {Promise<import("../models/InterviewModel.js").default>}
 */
export const updateInterviewProgress = async (interview, updates) => {
  if (updates.currentQuestionIndex !== undefined) {
    interview.current_question_index = updates.currentQuestionIndex;
  }
  if (updates.status) {
    interview.status = updates.status;
  }
  await interview.save();
  return interview;
};

/**
 * Records an answer and starts async AI scoring.
 * @param {import("../models/InterviewModel.js").default} interview
 * @param {number} questionIndex
 * @param {string} answer
 * @param {string|null} [requestId]
 * @returns {Promise<import("../models/ReportModel.js").default>}
 */
export const submitAnswer = async (interview, questionIndex, answer, requestId = null) => {
  const question = interview.questions[questionIndex];
  if (!question) throw AppError.fromCode(ERROR_CODES.VALIDATION_ERROR, "Invalid question index");

  let report = await Report.findOne({ interviewId: interview._id });
  if (!report) {
    report = new Report({
      interviewId: interview._id,
      userId: interview.user_id,
      answers: [],
    });
  }

  const existing = report.answers.find((a) => a.question === question.question);
  if (existing) {
    existing.userAnswer = answer;
    existing.scoringStatus = "pending";
    existing.score = null;
    existing.feedback = null;
  } else {
    report.answers.push({
      question: question.question,
      userAnswer: answer,
      preferredAnswer: question.preferred_answer,
      scoringStatus: "pending",
    });
  }

  await report.save();

  if (interview.status !== "completed") {
    interview.status = "in_progress";
    interview.current_question_index = questionIndex;
    await interview.save();
  }

  scoreAnswerAsync(interview, report._id.toString(), questionIndex, answer, requestId);

  return report;
};

/**
 * @param {import("../models/InterviewModel.js").default} interview
 * @param {string} reportId
 * @param {number} questionIndex
 * @param {string} answer
 * @param {string|null} [requestId]
 */
const scoreAnswerAsync = async (interview, reportId, questionIndex, answer, requestId = null) => {
  const question = interview.questions[questionIndex];
  const start = Date.now();
  const meta = {
    requestId,
    module: "interviewService",
    route: "async/scoreAnswer",
  };

  try {
    const result = await analyzeAnswer({
      question: question.question,
      userAnswer: answer,
      preferredAnswer: question.preferred_answer,
      role: interview.role,
      experience_level: interview.experience_level,
      interview_type: interview.interview_type,
    });

    const report = await Report.findById(reportId);
    const answerEntry = report.answers.find((a) => a.question === question.question);
    if (answerEntry) {
      answerEntry.score = result.score;
      answerEntry.feedback = result.feedback;
      answerEntry.tags = result.tags;
      answerEntry.scoringStatus = "scored";
      answerEntry.scoredAt = new Date();
    }

    const allSubmitted = report.answers.length >= interview.num_of_questions;
    const allScored = report.answers.every((a) => a.scoringStatus === "scored");

    if (allSubmitted && allScored) {
      await finalizeReport(interview, report, requestId);
    } else {
      await report.save();
    }

    log("info", "Answer scored", {
      ...meta,
      durationMs: Date.now() - start,
      statusCode: 200,
    });
  } catch (err) {
    log("error", "Answer scoring failed", {
      ...meta,
      durationMs: Date.now() - start,
      errorDetail: err.message,
    });
    const report = await Report.findById(reportId);
    const answerEntry = report?.answers.find((a) => a.question === question.question);
    if (answerEntry) {
      answerEntry.scoringStatus = "failed";
      answerEntry.feedback = "Scoring failed. Please retry.";
      await report.save();
    }
  }
};

/**
 * @param {import("../models/InterviewModel.js").default} interview
 * @param {import("../models/ReportModel.js").default} report
 * @param {string|null} [requestId]
 */
const finalizeReport = async (interview, report, requestId = null) => {
  const start = Date.now();
  const meta = {
    requestId,
    module: "interviewService",
    route: "async/finalizeReport",
  };

  report.summaryStatus = "generating";
  await report.save();

  const scoredAnswers = report.answers.filter((a) => a.scoringStatus === "scored");
  const avgScore =
    scoredAnswers.reduce((sum, a) => sum + a.score, 0) / scoredAnswers.length;

  report.finalScore = Number(avgScore.toFixed(2));

  try {
    const combinedFeedback = scoredAnswers
      .map((a) => `Q: ${a.question}\nScore: ${a.score}\nFeedback: ${a.feedback}`)
      .join("\n\n");

    const summary = await generateInterviewSummary(combinedFeedback);
    report.summary = summary.summary;
    report.strengths = summary.strengths;
    report.areaOfImprovement = summary.areaOfImprovement;
    report.summaryStatus = "completed";

    log("info", "Report summary generated", {
      ...meta,
      durationMs: Date.now() - start,
      statusCode: 200,
    });
  } catch (err) {
    log("error", "Summary generation failed", {
      ...meta,
      durationMs: Date.now() - start,
      errorDetail: err.message,
    });
    report.summaryStatus = "failed";
    report.summary = "Summary could not be generated.";
  }

  interview.status = "completed";
  await Promise.all([report.save(), interview.save()]);
};

/**
 * @param {string} interviewId
 * @returns {Promise<Object>}
 */
export const getScoringStatus = async (interviewId) => {
  const report = await Report.findOne({ interviewId });
  if (!report) {
    return { answers: [], summaryStatus: "pending", finalScore: null };
  }

  return {
    answers: report.answers.map((a) => ({
      question: a.question,
      scoringStatus: a.scoringStatus,
      score: a.score,
      feedback: a.feedback,
      tags: a.tags,
    })),
    summaryStatus: report.summaryStatus,
    finalScore: report.finalScore,
    isComplete: report.summaryStatus === "completed",
  };
};

/**
 * @param {string} userId
 * @returns {Promise<Object>}
 */
export const getDashboardAnalytics = async (userId) => {
  const reports = await Report.find({ userId, finalScore: { $ne: null } })
    .populate("interviewId")
    .sort({ createdAt: -1 });

  const scores = reports.map((r) => ({
    date: r.createdAt,
    score: r.finalScore,
    interviewName: r.interviewId?.interview_name,
    type: r.interviewId?.interview_type,
  }));

  const tagCounts = {};
  reports.forEach((r) => {
    r.answers.forEach((a) => {
      (a.tags || []).forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
  });

  const weakestTopics = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic, count]) => ({ topic, count }));

  const byType = { technical: [], behavioral: [], mixed: [] };
  reports.forEach((r) => {
    const type = r.interviewId?.interview_type;
    if (type && byType[type]) byType[type].push(r.finalScore);
  });

  const typeBreakdown = Object.fromEntries(
    Object.entries(byType).map(([type, arr]) => [
      type,
      arr.length ? Number((arr.reduce((s, v) => s + v, 0) / arr.length).toFixed(1)) : null,
    ])
  );

  const lastThree = reports.slice(0, 3).map((r) => ({
    id: r.interviewId?._id,
    name: r.interviewId?.interview_name,
    score: r.finalScore,
    date: r.createdAt,
    type: r.interviewId?.interview_type,
  }));

  return { scores, weakestTopics, typeBreakdown, lastThree, totalInterviews: reports.length };
};
