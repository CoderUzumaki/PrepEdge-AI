import express from "express";
import rateLimit from "express-rate-limit";
import { contactSchema } from "@prepedge/shared";
import { validate } from "../middleware/validate.js";
import * as contactController from "../controllers/contactController.js";

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: "Too many contact submissions" },
});

router.post("/", contactLimiter, validate(contactSchema), contactController.sendContact);
export default router;
