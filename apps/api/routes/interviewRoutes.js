import express from "express";
import multer from "multer";
import {
  interviewSetupSchema,
  submitAnswerSchema,
  updateInterviewProgressSchema,
  practiceQuestionSchema,
} from "@prepedge/shared";
import firebaseAuthMiddleware from "../middleware/firebaseAuthMiddleware.js";
import { validate } from "../middleware/validate.js";
import { requireInterviewOwner } from "../middleware/ownerMiddleware.js";
import { createRateLimiter } from "../middleware/rateLimit.js";
import * as interviewController from "../controllers/interviewController.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

const setupLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many interview setups, try again later",
});

const answerLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 30,
  message: "Too many answer submissions",
});

router.use(firebaseAuthMiddleware);

router.post(
  "/setup",
  setupLimiter,
  upload.single("resume"),
  (req, res, next) => {
    req.body = { ...req.body };
    next();
  },
  validate(interviewSetupSchema),
  interviewController.setupInterview
);

router.post(
  "/practice",
  setupLimiter,
  validate(practiceQuestionSchema),
  interviewController.createPractice
);

router.get("/analytics/dashboard", interviewController.getDashboardAnalytics);
router.get("/", interviewController.listInterviews);

router.get("/:id", requireInterviewOwner, interviewController.getInterview);
router.get("/:id/questions", requireInterviewOwner, interviewController.getQuestions);
router.get("/:id/scoring-status", requireInterviewOwner, interviewController.getScoringStatus);

router.patch(
  "/:id/progress",
  requireInterviewOwner,
  validate(updateInterviewProgressSchema),
  interviewController.updateProgress
);

router.post(
  "/:id/answers",
  requireInterviewOwner,
  answerLimiter,
  validate(submitAnswerSchema),
  interviewController.submitAnswer
);

export default router;
