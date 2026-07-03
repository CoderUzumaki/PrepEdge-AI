import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import ResumeCache from "../models/ResumeCacheModel.js";
import * as interviewService from "../services/interviewService.js";
import * as userService from "../services/userService.js";
import * as resumeService from "../services/resumeService.js";
import * as quotaService from "../services/quotaService.js";
import { hashBuffer } from "../utils/hash.js";

/**
 * @module controllers/interviewController
 * @description HTTP handlers for interview setup, sessions, and analytics.
 */

/**
 * Uploads a resume buffer to Cloudinary.
 * @param {Buffer} buffer
 * @returns {Promise<import("cloudinary").UploadApiResponse>}
 */
const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "raw", folder: "prepEdge/resumes" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

export const setupInterview = async (req, res, next) => {
  try {
    const user = await userService.getUserByFirebaseId(req.firebaseUser.uid);
    const data = req.validatedBody;

    quotaService.assertWithinLimit(user, "interviews_month");

    let resumeLink = null;
    let resumeSummary = null;
    let consumeResumeQuota = false;

    if (req.file?.buffer) {
      const fileHash = hashBuffer(req.file.buffer);
      const cached = await ResumeCache.findOne({
        fileHash,
        expiresAt: { $gt: new Date() },
      });
      if (!cached) {
        quotaService.assertWithinLimit(user, "resume_week");
        consumeResumeQuota = true;
      }

      if (process.env.CLOUDINARY_CLOUD_NAME) {
        const result = await uploadToCloudinary(req.file.buffer);
        resumeLink = result.secure_url;
      }
      const pdfData = await pdfParse(req.file.buffer);
      const text = pdfData.text.slice(0, 4000);
      resumeSummary = await resumeService.getOrCreateResumeSummary(req.file.buffer, text);
    }

    await quotaService.checkAndIncrement(user, "interviews_month");
    if (consumeResumeQuota) {
      await quotaService.checkAndIncrement(user, "resume_week");
    }

    const interview = await interviewService.createInterview(
      user._id.toString(),
      data,
      resumeLink,
      resumeSummary,
      req.requestId
    );

    res.success(
      {
        message: "Interview setup started",
        interviewId: interview._id,
        status: interview.status,
      },
      202
    );
  } catch (err) {
    next(err);
  }
};

export const createPractice = async (req, res, next) => {
  try {
    const user = await userService.getUserByFirebaseId(req.firebaseUser.uid);
    await quotaService.checkAndIncrement(user, "practice_day");
    const interview = await interviewService.createPracticeInterview(
      user._id.toString(),
      req.validatedBody
    );
    res.success({ interviewId: interview._id, interview }, 201);
  } catch (err) {
    next(err);
  }
};

export const listInterviews = async (req, res, next) => {
  try {
    const user = await userService.getUserByFirebaseId(req.firebaseUser.uid);
    const interviews = await interviewService.listUserInterviews(user._id.toString());
    res.success(interviews);
  } catch (err) {
    next(err);
  }
};

export const getInterview = async (req, res, next) => {
  try {
    res.success(req.interview);
  } catch (err) {
    next(err);
  }
};

export const getQuestions = async (req, res, next) => {
  try {
    res.success({
      status: req.interview.status,
      questions: req.interview.questions,
      currentQuestionIndex: req.interview.current_question_index,
      numOfQuestions: req.interview.num_of_questions,
    });
  } catch (err) {
    next(err);
  }
};

export const submitAnswer = async (req, res, next) => {
  try {
    const { questionIndex, answer } = req.validatedBody;
    const report = await interviewService.submitAnswer(
      req.interview,
      questionIndex,
      answer,
      req.requestId
    );
    res.success(
      {
        message: "Answer submitted, scoring in progress",
        reportId: report._id,
        scoringStatus: "pending",
      },
      202
    );
  } catch (err) {
    next(err);
  }
};

export const getScoringStatus = async (req, res, next) => {
  try {
    const status = await interviewService.getScoringStatus(req.interview._id);
    res.success(status);
  } catch (err) {
    next(err);
  }
};

export const updateProgress = async (req, res, next) => {
  try {
    const interview = await interviewService.updateInterviewProgress(
      req.interview,
      req.validatedBody
    );
    res.success(interview);
  } catch (err) {
    next(err);
  }
};

export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const user = await userService.getUserByFirebaseId(req.firebaseUser.uid);
    const analytics = await interviewService.getDashboardAnalytics(user._id.toString());
    res.success(analytics);
  } catch (err) {
    next(err);
  }
};
