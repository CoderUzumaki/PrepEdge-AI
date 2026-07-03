import express from "express";
import firebaseAuthMiddleware from "../middleware/firebaseAuthMiddleware.js";
import { createRateLimiter } from "../middleware/rateLimit.js";
import * as reportController from "../controllers/reportController.js";

const router = express.Router();

const publicShareLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: "Too many requests for shared reports",
});

router.get("/public/:token", publicShareLimiter, reportController.getPublicReport);

router.use(firebaseAuthMiddleware);
router.get("/", reportController.listReports);
router.post("/:interviewId/share", reportController.enableShare);
router.delete("/:interviewId/share", reportController.disableShare);
router.get("/:interviewId", reportController.getReport);

export default router;
