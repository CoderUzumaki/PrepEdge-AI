import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import * as interviewService from "../services/interviewService.js";
import * as userService from "../services/userService.js";
import * as resumeService from "../services/resumeService.js";

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

    let resumeLink = null;
    let resumeSummary = null;

    if (req.file?.buffer) {
      if (process.env.CLOUDINARY_CLOUD_NAME) {
        const result = await uploadToCloudinary(req.file.buffer);
        resumeLink = result.secure_url;
      }
      const pdfData = await pdfParse(req.file.buffer);
      const text = pdfData.text.slice(0, 4000);
      resumeSummary = await resumeService.getOrCreateResumeSummary(req.file.buffer, text);
    }

    const interview = await interviewService.createInterview(
      user._id.toString(),
      data,
      resumeLink,
      resumeSummary
    );

    res.status(202).json({
      message: "Interview setup started",
      interviewId: interview._id,
      status: interview.status,
    });
  } catch (err) {
    next(err);
  }
};

export const createPractice = async (req, res, next) => {
  try {
    const user = await userService.getUserByFirebaseId(req.firebaseUser.uid);
    const interview = await interviewService.createPracticeInterview(
      user._id.toString(),
      req.validatedBody
    );
    res.status(201).json({ interviewId: interview._id, interview });
  } catch (err) {
    next(err);
  }
};

export const listInterviews = async (req, res, next) => {
  try {
    const user = await userService.getUserByFirebaseId(req.firebaseUser.uid);
    const interviews = await interviewService.listUserInterviews(user._id.toString());
    res.json(interviews);
  } catch (err) {
    next(err);
  }
};

export const getInterview = async (req, res, next) => {
  try {
    res.json(req.interview);
  } catch (err) {
    next(err);
  }
};

export const getQuestions = async (req, res, next) => {
  try {
    res.json({
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
    const report = await interviewService.submitAnswer(req.interview, questionIndex, answer);
    res.status(202).json({
      message: "Answer submitted, scoring in progress",
      reportId: report._id,
      scoringStatus: "pending",
    });
  } catch (err) {
    next(err);
  }
};

export const getScoringStatus = async (req, res, next) => {
  try {
    const status = await interviewService.getScoringStatus(req.interview._id);
    res.json(status);
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
    res.json(interview);
  } catch (err) {
    next(err);
  }
};

export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const user = await userService.getUserByFirebaseId(req.firebaseUser.uid);
    const analytics = await interviewService.getDashboardAnalytics(user._id.toString());
    res.json(analytics);
  } catch (err) {
    next(err);
  }
};
