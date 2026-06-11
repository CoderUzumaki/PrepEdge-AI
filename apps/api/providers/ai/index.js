import { AI_TASKS } from "@prepedge/shared";
import { getSystemPrompt, buildResumeSummaryPrompt, buildQuestionsPrompt, buildAnalyzeAnswerPrompt, buildSummaryPrompt, buildPracticeQuestionPrompt } from "./prompts.js";
import { groqComplete, isGroqAvailable } from "./providers/groq.js";
import { geminiComplete, isGeminiAvailable } from "./providers/gemini.js";
import { huggingFaceComplete, isHuggingFaceAvailable } from "./providers/huggingface.js";
import { parseJsonResponse, normalizeAiText } from "./parseJson.js";

const TASK_CHAINS = {
  [AI_TASKS.SUMMARIZE_RESUME]: ["gemini", "groq", "huggingface"],
  [AI_TASKS.GENERATE_QUESTIONS]: ["groq", "gemini", "huggingface"],
  [AI_TASKS.ANALYZE_ANSWER]: ["groq", "gemini", "huggingface"],
  [AI_TASKS.INTERVIEW_SUMMARY]: ["gemini", "groq", "huggingface"],
};

const PROVIDERS = {
  groq: { complete: groqComplete, available: isGroqAvailable },
  gemini: { complete: geminiComplete, available: isGeminiAvailable },
  huggingface: { complete: huggingFaceComplete, available: isHuggingFaceAvailable },
};

const completeWithFallback = async ({ task, user, maxTokens }) => {
  const chain = TASK_CHAINS[task] || ["groq", "gemini", "huggingface"];
  const system = getSystemPrompt(task);
  const errors = [];

  for (const providerName of chain) {
    const provider = PROVIDERS[providerName];
    if (!provider?.available()) continue;

    try {
      const text = await provider.complete({ system, user, maxTokens });
      return { text, provider: providerName };
    } catch (err) {
      errors.push(`${providerName}: ${err.message}`);
    }
  }

  throw new Error(`All AI providers failed: ${errors.join("; ")}`);
};

export const summarizeResume = async (rawText) => {
  const { user, maxTokens } = buildResumeSummaryPrompt(rawText);
  const { text } = await completeWithFallback({
    task: AI_TASKS.SUMMARIZE_RESUME,
    user,
    maxTokens,
  });
  const parsed = parseJsonResponse(text);
  return normalizeAiText(parsed.summary ?? parsed, text);
};

export const generateQuestions = async (params) => {
  const { user, maxTokens } = buildQuestionsPrompt(params);
  const { text } = await completeWithFallback({
    task: AI_TASKS.GENERATE_QUESTIONS,
    user,
    maxTokens,
  });
  const parsed = parseJsonResponse(text);
  if (!parsed.questions?.length) {
    throw new Error("No questions generated");
  }
  return parsed.questions.slice(0, params.num_of_questions);
};

export const analyzeAnswer = async (params) => {
  const { user, maxTokens } = buildAnalyzeAnswerPrompt(params);
  const { text } = await completeWithFallback({
    task: AI_TASKS.ANALYZE_ANSWER,
    user,
    maxTokens,
  });
  const parsed = parseJsonResponse(text);
  const score = Number(parsed.score);
  if (Number.isNaN(score) || score < 0 || score > 100) {
    throw new Error("Invalid score from AI");
  }
  return {
    score,
    feedback: parsed.feedback || "No feedback provided.",
    tags: parsed.tags || [],
  };
};

export const generateInterviewSummary = async (combinedFeedback) => {
  const { user, maxTokens } = buildSummaryPrompt(combinedFeedback);
  const { text } = await completeWithFallback({
    task: AI_TASKS.INTERVIEW_SUMMARY,
    user,
    maxTokens,
  });
  const parsed = parseJsonResponse(text);
  return {
    summary: normalizeAiText(parsed.summary),
    strengths: normalizeAiText(parsed.strengths),
    areaOfImprovement: normalizeAiText(parsed.areaOfImprovement ?? parsed.area_of_improvement),
  };
};

export const generatePracticeQuestion = async (params) => {
  const { user, maxTokens } = buildPracticeQuestionPrompt(params);
  const { text } = await completeWithFallback({
    task: AI_TASKS.GENERATE_QUESTIONS,
    user,
    maxTokens,
  });
  const parsed = parseJsonResponse(text);
  return parsed.questions?.[0] || null;
};

export { parseJsonResponse };
