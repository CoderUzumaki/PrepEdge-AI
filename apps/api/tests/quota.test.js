import { describe, it, expect } from "vitest";
import {
  startOfUtcMonth,
  startOfUtcDay,
  startOfUtcWeek,
  nextPeriodStart,
  periodStartForKey,
  USAGE_CAPS,
} from "@prepedge/shared";
import {
  refreshQuotaPeriod,
  getQuotaSnapshot,
  assertWithinLimit,
} from "../services/quotaService.js";
import { AppError, ERROR_CODES } from "@prepedge/shared";

/** @returns {import("../models/UserModel.js").default} */
const mockUser = (quotas = {}) => ({
  usage_quotas: {
    interviews_month: { count: 0, period_start: new Date(0) },
    practice_day: { count: 0, period_start: new Date(0) },
    resume_week: { count: 0, period_start: new Date(0) },
    stt_day: { count: 0, period_start: new Date(0) },
    ...quotas,
  },
  save: async () => {},
});

describe("UTC period helpers", () => {
  it("startOfUtcMonth returns first day of month UTC", () => {
    const d = startOfUtcMonth(new Date("2026-03-15T12:00:00Z"));
    expect(d.toISOString()).toBe("2026-03-01T00:00:00.000Z");
  });

  it("startOfUtcDay returns midnight UTC", () => {
    const d = startOfUtcDay(new Date("2026-03-15T18:30:00Z"));
    expect(d.toISOString()).toBe("2026-03-15T00:00:00.000Z");
  });

  it("startOfUtcWeek returns Monday UTC", () => {
    // 2026-03-15 is Sunday
    const d = startOfUtcWeek(new Date("2026-03-15T12:00:00Z"));
    expect(d.toISOString()).toBe("2026-03-09T00:00:00.000Z");
  });

  it("nextPeriodStart for month advances to next month", () => {
    const next = nextPeriodStart("interviews_month", new Date("2026-01-20T00:00:00Z"));
    expect(next.toISOString()).toBe("2026-02-01T00:00:00.000Z");
  });

  it("periodStartForKey matches helper functions", () => {
    const now = new Date("2026-07-03T10:00:00Z");
    expect(periodStartForKey("interviews_month", now).toISOString()).toBe(
      startOfUtcMonth(now).toISOString()
    );
    expect(periodStartForKey("practice_day", now).toISOString()).toBe(
      startOfUtcDay(now).toISOString()
    );
    expect(periodStartForKey("resume_week", now).toISOString()).toBe(
      startOfUtcWeek(now).toISOString()
    );
  });
});

describe("quotaService period reset", () => {
  it("resets interview count when period_start is in a prior month", () => {
    const user = mockUser({
      interviews_month: { count: 3, period_start: new Date("2026-01-15T00:00:00Z") },
    });
    const now = new Date("2026-02-10T00:00:00Z");
    refreshQuotaPeriod(user, "interviews_month", now);
    expect(user.usage_quotas.interviews_month.count).toBe(0);
    expect(user.usage_quotas.interviews_month.period_start.toISOString()).toBe(
      "2026-02-01T00:00:00.000Z"
    );
  });

  it("does not reset count within the same UTC month", () => {
    const user = mockUser({
      interviews_month: { count: 2, period_start: new Date("2026-03-01T00:00:00Z") },
    });
    refreshQuotaPeriod(user, "interviews_month", new Date("2026-03-20T00:00:00Z"));
    expect(user.usage_quotas.interviews_month.count).toBe(2);
  });

  it("getQuotaSnapshot reports remaining capacity", () => {
    const user = mockUser({
      interviews_month: { count: 2, period_start: new Date("2026-07-01T00:00:00Z") },
    });
    const snap = getQuotaSnapshot(user, "interviews_month", new Date("2026-07-03T00:00:00Z"));
    expect(snap.used).toBe(2);
    expect(snap.limit).toBe(USAGE_CAPS.interviews_month);
    expect(snap.remaining).toBe(1);
    expect(snap.resetsAt).toBe("2026-08-01T00:00:00.000Z");
  });

  it("assertWithinLimit throws rate_limited at cap", () => {
    const user = mockUser({
      interviews_month: { count: 3, period_start: new Date("2026-07-01T00:00:00Z") },
    });
    expect(() =>
      assertWithinLimit(user, "interviews_month", new Date("2026-07-03T00:00:00Z"))
    ).toThrow(AppError);

    try {
      assertWithinLimit(user, "interviews_month", new Date("2026-07-03T00:00:00Z"));
    } catch (err) {
      expect(err.code).toBe(ERROR_CODES.RATE_LIMITED);
      expect(err.details.quotaKey).toBe("interviews_month");
    }
  });
});
