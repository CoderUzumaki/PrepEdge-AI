import express from "express";
import multer from "multer";
import { createTemplateSchema } from "@prepedge/shared";
import firebaseAuthMiddleware from "../middleware/firebaseAuthMiddleware.js";
import { validate } from "../middleware/validate.js";
import { createRateLimiter } from "../middleware/rateLimit.js";
import * as templateController from "../controllers/templateController.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

const setupLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many interview setups, try again later",
});

router.use(firebaseAuthMiddleware);

router.get("/", templateController.listTemplates);
router.get("/:id", templateController.getTemplate);
router.post("/", validate(createTemplateSchema), templateController.createTemplate);
router.delete("/:id", templateController.deleteTemplate);
router.post(
  "/:id/start",
  setupLimiter,
  upload.single("resume"),
  templateController.startFromTemplate
);

export default router;
