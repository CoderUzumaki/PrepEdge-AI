import express from "express";
import { contactSchema } from "@prepedge/shared";
import { validate } from "../middleware/validate.js";
import { createRateLimiter } from "../middleware/rateLimit.js";
import * as contactController from "../controllers/contactController.js";

const router = express.Router();

const contactLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: "Too many contact submissions",
});

router.post("/", contactLimiter, validate(contactSchema), contactController.sendContact);

export default router;
