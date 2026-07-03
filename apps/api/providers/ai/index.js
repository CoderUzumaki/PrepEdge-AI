import { AI_TASKS, AppError, ERROR_CODES, assertSafeForAi } from "@prepedge/shared";
import {
  getSystemPrompt,
  buildResumeSummaryPrompt,
  buildQuestionsPrompt,
  buildAnalyzeAnswerPrompt,
  buildSummaryPrompt,
  buildPracticeQuestionPrompt,
} from "./prompts.js";
import { groqComplete, isGroqAvailable } from "./providers/groq.js";
import { geminiComplete, isGeminiAvailable } from "./providers/gemini.js";
import { huggingFaceComplete, isHuggingFaceAvailable } from "./providers/huggingface.js";
import { parseJsonResponse, normalizeAiText } from "./parseJson.js";
import {
  validateAnswerOutput,
  validateResumeSummaryOutput,
  validateQuestionsOutput,
  validateInterviewSummaryOutput,
} from "./validateOutput.js";
import { toAiAppError } from "./aiErrors.js";

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

/**
 * @param {Object} params
 * @param {string} params.task
 * @param {string} params.user
 * @param {number} params.maxTokens
 */
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

  throw AppError.fromCode(
    ERROR_CODES.UPSTREAM_FAILURE,
    `All AI providers failed: ${errors.join("; ")}`
  );
};

/**
 * @param {Function} fn
 */
const runAiTask = async (fn) => {
  try {
    return await fn();
  } catch (err) {
    throw toAiAppError(err);
  }
};

export const summarizeResume = async (rawText) =>
  runAiTask(async () => {
    const safeText = assertSafeForAi(rawText, { field: "resume_text", label: "resume" });
    const { user, maxTokens } = buildResumeSummaryPrompt(safeText);
    const { text } = await completeWithFallback({
      task: AI_TASKS.SUMMARIZE_RESUME,
      user,
      maxTokens,
    });
    const parsed = parseJsonResponse(text);
    const { summary } = validateResumeSummaryOutput(parsed);
    return normalizeAiText(summary, text);
  });

export const generateQuestions = async (params) =>
  runAiTask(async () => {
    const safeParams = {
      ...params,
      role: assertSafeForAi(params.role, { field: "general", label: "role" }),
      company_name: params.company_name
        ? assertSafeForAi(params.company_name, { field: "general", label: "company name" })
        : "",
      company_description: params.company_description
        ? assertSafeForAi(params.company_description, {
            field: "company_description",
            label: "company description",
          })
        : "",
      job_description: params.job_description
        ? assertSafeForAi(params.job_description, {
            field: "job_description",
            label: "job description",
          })
        : "",
      resume_summary: params.resume_summary
        ? assertSafeForAi(params.resume_summary, { field: "resume_text", label: "resume summary" })
        : "",
      focus_area: params.focus_area
        ? assertSafeForAi(params.focus_area, { field: "focus_area", label: "focus area" })
        : "",
    };

    const { user, maxTokens } = buildQuestionsPrompt(safeParams);
    const { text } = await completeWithFallback({
      task: AI_TASKS.GENERATE_QUESTIONS,
      user,
      maxTokens,
    });
    const parsed = parseJsonResponse(text);
    return validateQuestionsOutput(parsed, params.num_of_questions);
  });

export const analyzeAnswer = async (params) =>
  runAiTask(async () => {
    const safeAnswer = assertSafeForAi(params.userAnswer, {
      field: "user_answer",
      label: "answer",
    });

    const { user, maxTokens } = buildAnalyzeAnswerPrompt({
      ...params,
      userAnswer: safeAnswer,
    });
    const { text } = await completeWithFallback({
      task: AI_TASKS.ANALYZE_ANSWER,
      user,
      maxTokens,
    });
    const parsed = parseJsonResponse(text);
    return validateAnswerOutput(parsed);
  });

export const generateInterviewSummary = async (combinedFeedback) =>
  runAiTask(async () => {
    const { user, maxTokens } = buildSummaryPrompt(combinedFeedback.slice(0, 6000));
    const { text } = await completeWithFallback({
      task: AI_TASKS.INTERVIEW_SUMMARY,
      user,
      maxTokens,
    });
    const parsed = parseJsonResponse(text);
    return validateInterviewSummaryOutput(parsed);
  });

export const generatePracticeQuestion = async (params) =>
  runAiTask(async () => {
    const safeParams = {
      ...params,
      role: assertSafeForAi(params.role, { field: "general", label: "role" }),
      topic: params.topic
        ? assertSafeForAi(params.topic, { field: "topic", label: "topic" })
        : "",
    };

    const { user, maxTokens } = buildPracticeQuestionPrompt(safeParams);
    const { text } = await completeWithFallback({
      task: AI_TASKS.GENERATE_QUESTIONS,
      user,
      maxTokens,
    });
    const parsed = parseJsonResponse(text);
    const questions = validateQuestionsOutput(parsed, 1);
    return questions[0] || null;
  });

export { parseJsonResponse };
