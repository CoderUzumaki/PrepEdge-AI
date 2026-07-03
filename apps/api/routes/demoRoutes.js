import express from "express";
import { sampleAnswerSchema } from "@prepedge/shared";
import { validate } from "../middleware/validate.js";
import { createRateLimiter } from "../middleware/rateLimit.js";
import * as demoController from "../controllers/demoController.js";

const router = express.Router();

const sampleLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: "Too many sample question attempts. Try again later.",
});

const sessionLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many demo session requests. Try again later.",
});

router.get("/sample-question", demoController.getSampleQuestion);
router.post(
  "/sample-answer",
  sampleLimiter,
  validate(sampleAnswerSchema),
  demoController.submitSampleAnswer
);
router.post("/session", sessionLimiter, demoController.createSession);

export default router;
