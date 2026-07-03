/**
 * @module services/quotaService
 * @description Per-user usage caps with UTC period resets (mock interviews, practice, resume, STT).
 */

import {
  AppError,
  ERROR_CODES,
  USAGE_CAPS,
  QUOTA_LIMIT_MESSAGES,
  periodStartForKey,
  nextPeriodStart,
} from "@prepedge/shared";

/**
 * @typedef {keyof typeof USAGE_CAPS} QuotaKey
 */

/**
 * Ensures usage_quotas subdocuments exist on legacy users.
 * @param {import("../models/UserModel.js").default} user
 */
const ensureQuotaFields = (user) => {
  if (!user.usage_quotas) {
    user.usage_quotas = {};
  }
  for (const key of Object.keys(USAGE_CAPS)) {
    if (!user.usage_quotas[key]) {
      user.usage_quotas[key] = { count: 0, period_start: new Date(0) };
    }
  }
};

/**
 * Resets a counter when the stored period_start is before the current period boundary.
 * @param {import("../models/UserModel.js").default} user
 * @param {QuotaKey} quotaKey
 * @param {Date} [now]
 */
export const refreshQuotaPeriod = (user, quotaKey, now = new Date()) => {
  ensureQuotaFields(user);
  const quota = user.usage_quotas[quotaKey];
  const currentPeriodStart = periodStartForKey(quotaKey, now);

  if (!quota.period_start || quota.period_start < currentPeriodStart) {
    quota.count = 0;
    quota.period_start = currentPeriodStart;
  }
};

/**
 * Refreshes all quota periods on the user document.
 * @param {import("../models/UserModel.js").default} user
 * @param {Date} [now]
 */
export const refreshAllQuotaPeriods = (user, now = new Date()) => {
  for (const key of Object.keys(USAGE_CAPS)) {
    refreshQuotaPeriod(user, key, now);
  }
};

/**
 * @param {import("../models/UserModel.js").default} user
 * @param {QuotaKey} quotaKey
 * @param {Date} [now]
 * @returns {{ used: number, limit: number, remaining: number, resetsAt: string }}
 */
export const getQuotaSnapshot = (user, quotaKey, now = new Date()) => {
  refreshQuotaPeriod(user, quotaKey, now);
  const used = user.usage_quotas[quotaKey].count;
  const limit = USAGE_CAPS[quotaKey];
  return {
    used,
    limit,
    remaining: Math.max(0, limit - used),
    resetsAt: nextPeriodStart(quotaKey, now).toISOString(),
  };
};

/**
 * Returns all quota counters for the authenticated user.
 * @param {import("../models/UserModel.js").default} user
 * @param {Date} [now]
 * @returns {Record<QuotaKey, { used: number, limit: number, remaining: number, resetsAt: string }>}
 */
export const getQuotaStatus = (user, now = new Date()) => {
  refreshAllQuotaPeriods(user, now);
  return Object.fromEntries(
    Object.keys(USAGE_CAPS).map((key) => [key, getQuotaSnapshot(user, key, now)])
  );
};

/**
 * Throws rate_limited when the user is at or over the cap (does not increment).
 * @param {import("../models/UserModel.js").default} user
 * @param {QuotaKey} quotaKey
 * @param {Date} [now]
 */
export const assertWithinLimit = (user, quotaKey, now = new Date()) => {
  const snapshot = getQuotaSnapshot(user, quotaKey, now);
  if (snapshot.used >= snapshot.limit) {
    throw AppError.fromCode(ERROR_CODES.RATE_LIMITED, QUOTA_LIMIT_MESSAGES[quotaKey], {
      quotaKey,
      ...snapshot,
    });
  }
};

/**
 * Asserts headroom then increments the counter. Persists the user document.
 * @param {import("../models/UserModel.js").default} user
 * @param {QuotaKey} quotaKey
 * @param {Date} [now]
 * @returns {Promise<import("../models/UserModel.js").default>}
 */
export const checkAndIncrement = async (user, quotaKey, now = new Date()) => {
  assertWithinLimit(user, quotaKey, now);
  user.usage_quotas[quotaKey].count += 1;
  await user.save();
  return user;
};

/**
 * STT quota helper — wired by M4 speech routes.
 * @param {import("../models/UserModel.js").default} user
 * @param {Date} [now]
 * @returns {Promise<import("../models/UserModel.js").default>}
 */
export const checkAndIncrementStt = (user, now = new Date()) =>
  checkAndIncrement(user, "stt_day", now);
