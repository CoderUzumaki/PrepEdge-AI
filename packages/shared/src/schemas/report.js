import { z } from "zod";
import { SCORING_STATUSES } from "../constants.js";

export const reportAnswerSchema = z.object({
  question: z.string(),
  userAnswer: z.string(),
  preferredAnswer: z.string(),
  score: z.number().min(0).max(100).nullable().optional(),
  feedback: z.string().nullable().optional(),
  scoringStatus: z.enum(SCORING_STATUSES).default("pending"),
  tags: z.array(z.string()).optional().default([]),
  speechMetrics: z
    .object({
      wordCount: z.number().optional(),
      fillerCount: z.number().optional(),
      wordsPerMinute: z.number().optional(),
      durationSeconds: z.number().optional(),
      fillerWords: z.array(z.string()).optional(),
    })
    .optional(),
  scoredAt: z.date().optional(),
});
