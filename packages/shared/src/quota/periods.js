/**
 * @module shared/quota/periods
 * @description UTC period boundaries for usage quota resets (PRD OQ-5: calendar month UTC).
 */

/**
 * @param {Date} [date]
 * @returns {Date} Start of UTC calendar month
 */
export function startOfUtcMonth(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

/**
 * @param {Date} [date]
 * @returns {Date} Start of UTC calendar day (midnight)
 */
export function startOfUtcDay(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/**
 * @param {Date} [date]
 * @returns {Date} Start of UTC week (Monday 00:00 UTC)
 */
export function startOfUtcWeek(date = new Date()) {
  const day = date.getUTCDay();
  const daysSinceMonday = (day + 6) % 7;
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - daysSinceMonday)
  );
}

/**
 * @param {"interviews_month"|"practice_day"|"resume_week"|"stt_day"} quotaKey
 * @param {Date} [date]
 * @returns {Date} When the current quota period ends (start of next period)
 */
export function nextPeriodStart(quotaKey, date = new Date()) {
  switch (quotaKey) {
    case "interviews_month": {
      const start = startOfUtcMonth(date);
      return new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1));
    }
    case "practice_day":
    case "stt_day": {
      const start = startOfUtcDay(date);
      return new Date(start.getTime() + 24 * 60 * 60 * 1000);
    }
    case "resume_week": {
      const start = startOfUtcWeek(date);
      return new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
    }
    default:
      throw new Error(`Unknown quota key: ${quotaKey}`);
  }
}

/**
 * @param {"interviews_month"|"practice_day"|"resume_week"|"stt_day"} quotaKey
 * @param {Date} [date]
 * @returns {Date} Start of the active period for the given key
 */
export function periodStartForKey(quotaKey, date = new Date()) {
  switch (quotaKey) {
    case "interviews_month":
      return startOfUtcMonth(date);
    case "practice_day":
    case "stt_day":
      return startOfUtcDay(date);
    case "resume_week":
      return startOfUtcWeek(date);
    default:
      throw new Error(`Unknown quota key: ${quotaKey}`);
  }
}
