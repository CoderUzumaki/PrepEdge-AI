import { describe, it, expect, vi, beforeEach } from "vitest";
import { computeSpeechSummary } from "@prepedge/shared";
import { ERROR_CODES } from "@prepedge/shared";

vi.mock("../models/ReportModel.js", () => ({
  default: {
    findOne: vi.fn(),
    find: vi.fn(),
    deleteMany: vi.fn(),
  },
}));

vi.mock("../models/InterviewModel.js", () => ({
  default: {
    findById: vi.fn(),
  },
}));

import Report from "../models/ReportModel.js";
import Interview from "../models/InterviewModel.js";
import {
  sanitizePublicReport,
  getPublicReportByToken,
  enableReportShare,
  disableReportShare,
} from "../services/reportService.js";

describe("computeSpeechSummary", () => {
  it("aggregates WPM and fillers across answers", () => {
    const summary = computeSpeechSummary([
      { speechMetrics: { wordCount: 10, wordsPerMinute: 120, fillerCount: 2 } },
      { speechMetrics: { wordCount: 8, wordsPerMinute: 100, fillerCount: 1 } },
      { speechMetrics: { wordCount: 0 } },
    ]);
    expect(summary).toEqual({ avgWpm: 110, totalFillers: 3, questionsWithSpeech: 2 });
  });

  it("returns null when no speech data", () => {
    expect(computeSpeechSummary([{ speechMetrics: { wordCount: 0 } }])).toBeNull();
    expect(computeSpeechSummary([])).toBeNull();
  });
});

describe("sanitizePublicReport", () => {
  it("omits internal fields and keeps display fields", () => {
    const publicReport = sanitizePublicReport(
      {
        finalScore: 82,
        summary: "Good",
        strengths: "DSA",
        areaOfImprovement: "Behavioral",
        createdAt: new Date("2026-07-01"),
        shareExpiresAt: new Date("2026-07-08"),
        userId: "secret-user",
        answers: [
          {
            question: "Q1",
            userAnswer: "A1",
            preferredAnswer: "P1",
            score: 80,
            feedback: "Nice",
            tags: ["react"],
            speechMetrics: { wordCount: 5, wordsPerMinute: 100, fillerCount: 0 },
            rawAiResponse: "hidden",
          },
        ],
      },
      { interview_name: "React Mock" }
    );

    expect(publicReport.interviewName).toBe("React Mock");
    expect(publicReport.finalScore).toBe(82);
    expect(publicReport.answers[0].feedback).toBe("Nice");
    expect(publicReport.answers[0].rawAiResponse).toBeUndefined();
    expect(publicReport.userId).toBeUndefined();
  });
});

describe("report share service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getPublicReportByToken rejects expired links", async () => {
    Report.findOne.mockResolvedValue({
      shareToken: "tok",
      shareExpiresAt: new Date("2020-01-01"),
      interviewId: "iv1",
    });

    await expect(getPublicReportByToken("tok")).rejects.toMatchObject({
      code: ERROR_CODES.NOT_FOUND,
    });
  });

  it("enableReportShare sets token and expiry", async () => {
    const save = vi.fn();
    Interview.findById.mockResolvedValue({ user_id: "user-1" });
    Report.findOne.mockResolvedValue({
      interviewId: "iv1",
      shareToken: null,
      shareExpiresAt: null,
      save,
    });

    const report = await enableReportShare("iv1", "user-1");
    expect(report.shareToken).toBeTruthy();
    expect(report.shareExpiresAt).toBeInstanceOf(Date);
    expect(save).toHaveBeenCalled();
  });

  it("disableReportShare clears token fields", async () => {
    const save = vi.fn();
    Interview.findById.mockResolvedValue({ user_id: "user-1" });
    Report.findOne.mockResolvedValue({
      shareToken: "old",
      shareExpiresAt: new Date(),
      save,
    });

    const report = await disableReportShare("iv1", "user-1");
    expect(report.shareToken).toBeNull();
    expect(report.shareExpiresAt).toBeNull();
    expect(save).toHaveBeenCalled();
  });
});
