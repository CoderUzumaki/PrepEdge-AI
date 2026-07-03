import { z } from "zod";
import { EXPERIENCE_LEVELS, INTERVIEW_TYPES } from "../constants.js";

export const templateFieldsSchema = z.object({
  interviewName: z.string().min(1).max(200),
  numOfQuestions: z.coerce.number().int().min(3).max(10),
  interviewType: z.enum(INTERVIEW_TYPES),
  role: z.string().min(1).max(200),
  experienceLevel: z.enum(EXPERIENCE_LEVELS),
  companyName: z.string().max(200).optional().default(""),
  companyDescription: z.string().max(5000).optional().default(""),
  jobDescription: z.string().max(10000).optional().default(""),
  focusArea: z.string().max(500).optional().default(""),
});

export const createTemplateSchema = templateFieldsSchema.extend({
  name: z.string().min(1).max(100),
});
