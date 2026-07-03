import { z } from "zod";
import { EXPERIENCE_LEVELS, INTERVIEW_TYPES } from "../constants.js";

export const interviewSetupSchema = z.object({
  interviewName: z.string().min(1).max(200),
  numOfQuestions: z.coerce.number().int().min(3).max(10),
  interviewType: z.enum(INTERVIEW_TYPES),
  role: z.string().min(1).max(200),
  experienceLevel: z.enum(EXPERIENCE_LEVELS),
  companyName: z.string().max(200).optional().default(""),
  companyDescription: z.string().max(5000).optional().default(""),
  jobDescription: z.string().max(10000).optional().default(""),
  focusAt: z.string().max(500).optional().default(""),
});

export const speechMetricsSchema = z.object({
  wordCount: z.number().int().min(0),
  fillerCount: z.number().int().min(0),
  wordsPerMinute: z.number().min(0),
  durationSeconds: z.number().min(0).optional(),
  fillerWords: z.array(z.string()).max(50).optional().default([]),
});

export const submitAnswerSchema = z.object({
  questionIndex: z.coerce.number().int().min(0),
  answer: z.string().min(1).max(10000),
  speechMetrics: speechMetricsSchema.optional(),
});

export const updateInterviewProgressSchema = z.object({
  currentQuestionIndex: z.coerce.number().int().min(0),
  status: z.enum(["in_progress", "completed"]).optional(),
});

export const questionSchema = z.object({
  question: z.string(),
  preferred_answer: z.string(),
});

export const generatedQuestionsSchema = z.object({
  questions: z.array(questionSchema).min(1),
});

export const answerScoreSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string(),
  tags: z.array(z.string()).optional().default([]),
});

export const interviewSummarySchema = z.object({
  summary: z.string(),
  strengths: z.string(),
  areaOfImprovement: z.string(),
});

export const practiceQuestionSchema = z.object({
  role: z.string().min(1).max(200),
  experienceLevel: z.enum(EXPERIENCE_LEVELS),
  interviewType: z.enum(INTERVIEW_TYPES),
  topic: z.string().min(1).max(500).optional(),
});
