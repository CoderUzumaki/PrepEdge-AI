/**
 * @module shared/sanitizer/inputSanitizer
 * @description Sanitize and validate user text before AI provider calls (prompt injection defense).
 */

import { AppError, ERROR_CODES } from "../errors/index.js";

/** @type {Record<string, number>} */
export const AI_INPUT_MAX_LENGTHS = {
  user_answer: 10_000,
  resume_text: 4_000,
  job_description: 8_000,
  company_description: 4_000,
  focus_area: 500,
  topic: 500,
  general: 10_000,
};

/** High-risk patterns — content matching these must not reach the model as-is. */
const INJECTION_PATTERNS = [
  { id: "ignore_previous", regex: /ignore\s+(all\s+)?(previous|prior)\s+instructions/i },
  { id: "ignore_previous_short", regex: /ignore\s+previous/i },
  { id: "system_prompt", regex: /system\s+prompt/i },
  { id: "you_are_now", regex: /you\s+are\s+now/i },
  { id: "disregard_prior", regex: /disregard\s+(all\s+)?(prior|previous)/i },
  { id: "json_score_injection", regex: /```json\s*\{\s*"score"\s*:\s*100/i },
  { id: "output_only_json", regex: /output\s+only\s*:\s*\{/i },
  { id: "act_as_new", regex: /act\s+as\s+(a\s+)?new\s+/i },
];

/**
 * Wraps untrusted user content in explicit XML-style delimiters for prompts.
 * @param {string} tag - Delimiter tag name (e.g. user_answer, resume_text)
 * @param {string} content - Sanitized content
 * @returns {string}
 */
export function wrapUntrustedContent(tag, content) {
  return `<${tag}>\n${content}\n</${tag}>`;
}

/**
 * Sanitizes text for AI: strips null bytes, truncates, detects injection patterns.
 * @param {string} text
 * @param {Object} [options]
 * @param {keyof typeof AI_INPUT_MAX_LENGTHS} [options.field]
 * @param {number} [options.maxLength]
 * @returns {{ text: string, flagged: boolean, patterns: string[] }}
 */
export function sanitizeForAi(text, options = {}) {
  if (text == null) {
    return { text: "", flagged: false, patterns: [] };
  }

  const raw = String(text);
  let sanitized = raw.replace(/\0/g, "");
  const limit = options.maxLength ?? AI_INPUT_MAX_LENGTHS[options.field] ?? AI_INPUT_MAX_LENGTHS.general;
  if (sanitized.length > limit) {
    sanitized = sanitized.slice(0, limit);
  }

  const patterns = INJECTION_PATTERNS.filter(({ regex }) => regex.test(sanitized)).map(
    ({ id }) => id
  );

  return {
    text: sanitized,
    flagged: patterns.length > 0,
    patterns,
  };
}

/**
 * Sanitizes input and throws guardrail_violation when injection patterns are detected.
 * @param {string} text
 * @param {Object} [options]
 * @param {keyof typeof AI_INPUT_MAX_LENGTHS} [options.field]
 * @param {string} [options.label] - Human-readable field name for error messages
 * @returns {string} Sanitized text safe to embed in prompts
 */
export function assertSafeForAi(text, options = {}) {
  const result = sanitizeForAi(text, options);
  if (result.flagged) {
    const label = options.label ?? options.field ?? "input";
    throw AppError.fromCode(
      ERROR_CODES.GUARDRAIL_VIOLATION,
      `Your ${label} contains disallowed instructions and cannot be processed.`,
      { patterns: result.patterns, field: options.field ?? "general" }
    );
  }
  return result.text;
}

/**
 * Sanitizes optional text; empty values pass through without checks.
 * @param {string|null|undefined} text
 * @param {Object} [options]
 * @returns {string}
 */
export function sanitizeOptionalForAi(text, options = {}) {
  if (!text) return "";
  return assertSafeForAi(text, options);
}
