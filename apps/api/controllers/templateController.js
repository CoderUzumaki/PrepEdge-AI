/**
 * @module controllers/templateController
 * @description HTTP handlers for interview templates.
 */

import * as userService from "../services/userService.js";
import * as templateService from "../services/templateService.js";
import * as interviewService from "../services/interviewService.js";
import * as quotaService from "../services/quotaService.js";
import * as resumeService from "../services/resumeService.js";
import { hashBuffer } from "../utils/hash.js";
import ResumeCache from "../models/ResumeCacheModel.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";
import pdfParse from "pdf-parse/lib/pdf-parse.js";

const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "raw", folder: "prepEdge/resumes" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

/**
 * GET /api/templates
 */
export const listTemplates = async (req, res, next) => {
  try {
    const user = await userService.getUserByFirebaseId(req.firebaseUser.uid);
    const templates = await templateService.listTemplates(user._id.toString());
    res.success(templates);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/templates/:id
 */
export const getTemplate = async (req, res, next) => {
  try {
    const user = await userService.getUserByFirebaseId(req.firebaseUser.uid);
    const template = await templateService.getTemplateById(req.params.id, user._id.toString());
    res.success(template);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/templates
 */
export const createTemplate = async (req, res, next) => {
  try {
    const user = await userService.getUserByFirebaseId(req.firebaseUser.uid);
    const template = await templateService.createUserTemplate(user._id.toString(), req.validatedBody);
    res.success(template, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/templates/:id
 */
export const deleteTemplate = async (req, res, next) => {
  try {
    const user = await userService.getUserByFirebaseId(req.firebaseUser.uid);
    await templateService.deleteUserTemplate(req.params.id, user._id.toString());
    res.success({ message: "Template deleted" });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/templates/:id/start — optional resume upload, starts interview from template.
 */
export const startFromTemplate = async (req, res, next) => {
  try {
    const user = await userService.getUserByFirebaseId(req.firebaseUser.uid);
    const template = await templateService.getTemplateById(req.params.id, user._id.toString());
    const setupPayload = templateService.templateToSetupPayload(template);

    quotaService.assertWithinLimit(user, "interviews_month");

    let resumeLink = null;
    let resumeSummary = null;
    let consumeResumeQuota = false;

    if (req.file?.buffer) {
      const fileHash = hashBuffer(req.file.buffer);
      const cached = await ResumeCache.findOne({ fileHash, expiresAt: { $gt: new Date() } });
      if (!cached) {
        quotaService.assertWithinLimit(user, "resume_week");
        consumeResumeQuota = true;
      }

      if (process.env.CLOUDINARY_CLOUD_NAME) {
        const result = await uploadToCloudinary(req.file.buffer);
        resumeLink = result.secure_url;
      }
      const pdfData = await pdfParse(req.file.buffer);
      resumeSummary = await resumeService.getOrCreateResumeSummary(
        req.file.buffer,
        pdfData.text.slice(0, 4000)
      );
    }

    await quotaService.checkAndIncrement(user, "interviews_month");
    if (consumeResumeQuota) {
      await quotaService.checkAndIncrement(user, "resume_week");
    }

    const interview = await interviewService.createInterview(
      user._id.toString(),
      setupPayload,
      resumeLink,
      resumeSummary,
      req.requestId
    );

    res.success(
      {
        message: "Interview started from template",
        interviewId: interview._id,
        status: interview.status,
        templateId: template._id,
      },
      202
    );
  } catch (err) {
    next(err);
  }
};
