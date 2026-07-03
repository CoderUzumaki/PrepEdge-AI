import express from "express";
import multer from "multer";
import firebaseAuthMiddleware from "../middleware/firebaseAuthMiddleware.js";
import { blockDemoWrites } from "../middleware/demoReadOnly.js";
import { createRateLimiter } from "../middleware/rateLimit.js";
import * as speechController from "../controllers/speechController.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
});

const sttLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 30,
  message: "Too many transcription requests",
});

const router = express.Router();

router.use(firebaseAuthMiddleware);
router.use(blockDemoWrites);

router.post(
  "/transcribe",
  sttLimiter,
  upload.single("audio"),
  speechController.transcribe
);

export default router;
