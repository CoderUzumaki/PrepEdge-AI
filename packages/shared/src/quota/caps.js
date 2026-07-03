/**
 * @module shared/quota/caps
 * @description Free-tier usage limits per user (enforced server-side).
 */

export const USAGE_CAPS = {
  interviews_month: 3,
  practice_day: 10,
  resume_week: 1,
  stt_day: 25,
};

export const QUOTA_KEYS = Object.keys(USAGE_CAPS);

/** @type {Record<keyof typeof USAGE_CAPS, string>} */
export const QUOTA_LABELS = {
  interviews_month: "Mock interviews",
  practice_day: "Practice questions",
  resume_week: "Resume uploads",
  stt_day: "Voice transcriptions",
};

/** @type {Record<keyof typeof USAGE_CAPS, string>} */
export const QUOTA_LIMIT_MESSAGES = {
  interviews_month: "You've used all 3 mock interviews for this month. Resets on the 1st (UTC).",
  practice_day: "You've reached today's practice limit (10). Try again tomorrow (UTC).",
  resume_week: "You've used your weekly resume upload (1 per week). Resets Monday (UTC).",
  stt_day: "You've reached today's voice transcription limit (25). Use text input or try again tomorrow (UTC).",
};
