import { z } from "zod";
import { EXPERIENCE_LEVELS, INTERVIEW_TYPES, USER_TIERS } from "../constants.js";

export const userPreferencesSchema = z.object({
  ttsEnabled: z.boolean().default(false),
  defaultInterviewType: z.enum(INTERVIEW_TYPES).default("mixed"),
  defaultExperienceLevel: z.enum(EXPERIENCE_LEVELS).default("fresher"),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  preferences: userPreferencesSchema.partial().optional(),
});
