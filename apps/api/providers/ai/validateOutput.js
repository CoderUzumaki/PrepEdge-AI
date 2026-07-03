/**
 * @module providers/ai/validateOutput
 * @description Schema validation for AI JSON responses before returning to services.
 */

const MAX_FEEDBACK_LENGTH = 2000;
const MAX_TAGS = 20;
const MAX_TAG_LENGTH = 100;

/**
 * @param {unknown} parsed
 * @returns {{ score: number, feedback: string, tags: string[] }}
 */
export function validateAnswerOutput(parsed) {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid AI answer output: not an object");
  }

  const score = Number(parsed.score);
  if (!Number.isFinite(score) || score < 0 || score > 100) {
    throw new Error("Invalid score from AI");
  }

  if (typeof parsed.feedback !== "string") {
    throw new Error("Invalid feedback from AI");
  }

  const feedback = parsed.feedback.trim().slice(0, MAX_FEEDBACK_LENGTH);
  const tags = Array.isArray(parsed.tags)
    ? parsed.tags
        .filter((t) => typeof t === "string")
        .map((t) => t.trim().slice(0, MAX_TAG_LENGTH))
        .filter(Boolean)
        .slice(0, MAX_TAGS)
    : [];

  return { score, feedback: feedback || "No feedback provided.", tags };
}

/**
 * @param {unknown} parsed
 * @returns {{ summary: string }}
 */
export function validateResumeSummaryOutput(parsed) {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid AI resume summary output");
  }
  const summary = parsed.summary;
  if (typeof summary !== "string" || !summary.trim()) {
    throw new Error("Invalid resume summary from AI");
  }
  return { summary: summary.trim().slice(0, 8000) };
}

/**
 * @param {unknown} parsed
 * @param {number} expectedCount
 * @returns {{ question: string, preferred_answer: string }[]}
 */
export function validateQuestionsOutput(parsed, expectedCount) {
  if (!parsed?.questions?.length) {
    throw new Error("No questions generated");
  }

  const questions = parsed.questions
    .filter((q) => q && typeof q.question === "string" && typeof q.preferred_answer === "string")
    .map((q) => ({
      question: q.question.trim().slice(0, 2000),
      preferred_answer: q.preferred_answer.trim().slice(0, 4000),
    }))
    .filter((q) => q.question && q.preferred_answer);

  if (!questions.length) {
    throw new Error("No valid questions in AI response");
  }

  return questions.slice(0, expectedCount);
}

/**
 * @param {unknown} parsed
 * @returns {{ summary: string, strengths: string, areaOfImprovement: string }}
 */
export function validateInterviewSummaryOutput(parsed) {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid AI interview summary output");
  }

  const pick = (value, max = 4000) => {
    if (typeof value !== "string" || !value.trim()) {
      throw new Error("Invalid interview summary field from AI");
    }
    return value.trim().slice(0, max);
  };

  return {
    summary: pick(parsed.summary),
    strengths: pick(parsed.strengths),
    areaOfImprovement: pick(parsed.areaOfImprovement ?? parsed.area_of_improvement),
  };
}
