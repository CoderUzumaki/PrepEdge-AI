import { describe, it, expect, vi, beforeEach } from "vitest";
import { SAMPLE_QUESTION } from "@prepedge/shared";

const mockAuth = {
  getUser: vi.fn(),
  createUser: vi.fn(),
  createCustomToken: vi.fn().mockResolvedValue("mock-token"),
};

vi.mock("../config/firebase.js", () => ({
  default: {
    auth: () => mockAuth,
  },
}));

vi.mock("../models/UserModel.js", () => ({
  default: {
    findOne: vi.fn(),
    countDocuments: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("../models/InterviewModel.js", () => ({
  default: {
    findOne: vi.fn(),
    countDocuments: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("../models/ReportModel.js", () => ({
  default: { create: vi.fn() },
}));

vi.mock("../providers/ai/index.js", () => ({
  analyzeAnswer: vi.fn(),
}));

import User from "../models/UserModel.js";
import Interview from "../models/InterviewModel.js";
import { analyzeAnswer } from "../providers/ai/index.js";
import {
  getSampleQuestion,
  scoreSampleAnswer,
  createDemoSession,
  DEMO_FIREBASE_UID,
} from "../services/demoService.js";

describe("demo sample question", () => {
  it("exports a fixed behavioral question", () => {
    const sample = getSampleQuestion();
    expect(sample.question).toBe(SAMPLE_QUESTION.question);
    expect(sample.role).toBe("Software Engineer");
  });

  it("scoreSampleAnswer uses AI when available", async () => {
    analyzeAnswer.mockResolvedValue({
      score: 75,
      feedback: "Good STAR structure.",
      tags: ["behavioral"],
    });

    const result = await scoreSampleAnswer(
      "I faced a production outage and coordinated the team to restore service within an hour."
    );
    expect(result.score).toBe(75);
    expect(result.source).toBe("ai");
  });

  it("scoreSampleAnswer falls back to heuristic when AI fails", async () => {
    analyzeAnswer.mockRejectedValue(new Error("AI down"));

    const result = await scoreSampleAnswer(
      "I solved a caching bug by profiling Redis and fixing TTL configuration for our API layer."
    );
    expect(result.score).toBeGreaterThan(40);
    expect(result.source).toBe("heuristic");
    expect(result.feedback).toBeTruthy();
  });
});

describe("demo session", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.getUser.mockRejectedValue({ code: "auth/user-not-found" });
    mockAuth.createUser.mockResolvedValue({});
    mockAuth.createCustomToken.mockResolvedValue("mock-token");
    User.findOne.mockResolvedValue({ _id: "u1", is_demo: true, save: vi.fn() });
    Interview.countDocuments.mockResolvedValue(3);
  });

  it("createDemoSession returns a custom token", async () => {
    const session = await createDemoSession();
    expect(session.customToken).toBe("mock-token");
    expect(mockAuth.createCustomToken).toHaveBeenCalledWith(DEMO_FIREBASE_UID);
  });
});
