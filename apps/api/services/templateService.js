/**
 * @module services/templateService
 * @description Interview template CRUD and system template seeding.
 */

import InterviewTemplate from "../models/InterviewTemplateModel.js";
import { AppError, ERROR_CODES } from "@prepedge/shared";

const MAX_USER_TEMPLATES = 10;

export const SYSTEM_TEMPLATES = [
  {
    name: "Frontend React — Junior",
    interview_name: "Frontend React — Junior",
    role: "Frontend Developer",
    experience_level: "junior",
    interview_type: "technical",
    num_of_questions: 5,
    focus_area: "React, JS, CSS",
  },
  {
    name: "Backend Node — Mid",
    interview_name: "Backend Node — Mid",
    role: "Backend Developer",
    experience_level: "mid",
    interview_type: "technical",
    num_of_questions: 5,
    focus_area: "APIs, databases",
  },
  {
    name: "System Design — Senior",
    interview_name: "System Design — Senior",
    role: "Software Engineer",
    experience_level: "senior",
    interview_type: "technical",
    num_of_questions: 7,
    focus_area: "system design",
  },
  {
    name: "Behavioral — Fresher",
    interview_name: "Behavioral — Fresher",
    role: "Software Engineer",
    experience_level: "fresher",
    interview_type: "behavioral",
    num_of_questions: 5,
    focus_area: "teamwork, projects",
  },
  {
    name: "Full Stack — Mixed",
    interview_name: "Full Stack — Mixed",
    role: "Full Stack Developer",
    experience_level: "mid",
    interview_type: "mixed",
    num_of_questions: 6,
    focus_area: "general",
  },
  {
    name: "DevOps — Mid",
    interview_name: "DevOps — Mid",
    role: "DevOps Engineer",
    experience_level: "mid",
    interview_type: "technical",
    num_of_questions: 5,
    focus_area: "CI/CD, cloud",
  },
];

/**
 * Seeds read-only system templates if missing.
 */
export const seedSystemTemplates = async () => {
  for (const template of SYSTEM_TEMPLATES) {
    await InterviewTemplate.findOneAndUpdate(
      { is_system: true, name: template.name },
      {
        ...template,
        is_system: true,
        user_id: null,
        company_name: "",
        company_description: "",
        job_description: "",
      },
      { upsert: true, new: true }
    );
  }
};

/**
 * @param {string} userId - MongoDB user ID
 */
export const listTemplates = async (userId) => {
  const [system, user] = await Promise.all([
    InterviewTemplate.find({ is_system: true }).sort({ name: 1 }).lean(),
    InterviewTemplate.find({ user_id: userId, is_system: false }).sort({ created_at: -1 }).lean(),
  ]);
  return { system, user };
};

/**
 * @param {string} templateId
 * @param {string} userId
 */
export const getTemplateById = async (templateId, userId) => {
  const template = await InterviewTemplate.findById(templateId);
  if (!template) {
    throw AppError.fromCode(ERROR_CODES.NOT_FOUND, "Template not found");
  }
  if (!template.is_system && template.user_id !== userId) {
    throw AppError.fromCode(ERROR_CODES.FORBIDDEN, "You do not have access to this template");
  }
  return template;
};

/**
 * @param {string} userId
 * @param {Object} data
 */
export const createUserTemplate = async (userId, data) => {
  const count = await InterviewTemplate.countDocuments({ user_id: userId, is_system: false });
  if (count >= MAX_USER_TEMPLATES) {
    throw AppError.fromCode(
      ERROR_CODES.RATE_LIMITED,
      `You can save up to ${MAX_USER_TEMPLATES} custom templates. Delete one to add another.`
    );
  }

  const existing = await InterviewTemplate.findOne({ user_id: userId, name: data.name });
  if (existing) {
    throw AppError.fromCode(ERROR_CODES.VALIDATION_ERROR, "A template with this name already exists");
  }

  const template = new InterviewTemplate({
    user_id: userId,
    is_system: false,
    name: data.name,
    interview_name: data.interviewName,
    num_of_questions: data.numOfQuestions,
    interview_type: data.interviewType,
    role: data.role,
    experience_level: data.experienceLevel,
    company_name: data.companyName || "",
    company_description: data.companyDescription || "",
    job_description: data.jobDescription || "",
    focus_area: data.focusArea || "",
  });

  await template.save();
  return template;
};

/**
 * @param {string} templateId
 * @param {string} userId
 */
export const deleteUserTemplate = async (templateId, userId) => {
  const template = await InterviewTemplate.findById(templateId);
  if (!template) {
    throw AppError.fromCode(ERROR_CODES.NOT_FOUND, "Template not found");
  }
  if (template.is_system) {
    throw AppError.fromCode(ERROR_CODES.FORBIDDEN, "System templates cannot be deleted");
  }
  if (template.user_id !== userId) {
    throw AppError.fromCode(ERROR_CODES.FORBIDDEN, "You do not own this template");
  }
  await template.deleteOne();
};

/**
 * @param {import("../models/InterviewTemplateModel.js").default} template
 */
export const templateToSetupPayload = (template) => ({
  interviewName: template.interview_name,
  numOfQuestions: template.num_of_questions,
  interviewType: template.interview_type,
  role: template.role,
  experienceLevel: template.experience_level,
  companyName: template.company_name || "",
  companyDescription: template.company_description || "",
  jobDescription: template.job_description || "",
  focusAt: template.focus_area || "",
});
