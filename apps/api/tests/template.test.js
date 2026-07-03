import { describe, it, expect, vi, beforeEach } from "vitest";
import { createTemplateSchema } from "@prepedge/shared";
import { ERROR_CODES } from "@prepedge/shared";
import {
  SYSTEM_TEMPLATES,
  templateToSetupPayload,
} from "../services/templateService.js";

vi.mock("../models/InterviewTemplateModel.js", () => {
  const mockModel = {
    find: vi.fn(),
    findById: vi.fn(),
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
    countDocuments: vi.fn(),
  };
  return { default: mockModel };
});

import InterviewTemplate from "../models/InterviewTemplateModel.js";
import {
  createUserTemplate,
  deleteUserTemplate,
  getTemplateById,
} from "../services/templateService.js";

describe("SYSTEM_TEMPLATES", () => {
  it("defines 6 pre-made templates", () => {
    expect(SYSTEM_TEMPLATES).toHaveLength(6);
    for (const t of SYSTEM_TEMPLATES) {
      expect(t.name).toBeTruthy();
      expect(t.role).toBeTruthy();
      expect(t.num_of_questions).toBeGreaterThanOrEqual(3);
      expect(t.num_of_questions).toBeLessThanOrEqual(10);
    }
  });
});

describe("templateToSetupPayload", () => {
  it("maps snake_case template fields to setup wizard keys", () => {
    const payload = templateToSetupPayload({
      interview_name: "Backend Node — Mid",
      num_of_questions: 5,
      interview_type: "technical",
      role: "Backend Developer",
      experience_level: "mid",
      company_name: "Acme",
      company_description: "A company",
      job_description: "Build APIs",
      focus_area: "databases",
    });

    expect(payload).toEqual({
      interviewName: "Backend Node — Mid",
      numOfQuestions: 5,
      interviewType: "technical",
      role: "Backend Developer",
      experienceLevel: "mid",
      companyName: "Acme",
      companyDescription: "A company",
      jobDescription: "Build APIs",
      focusAt: "databases",
    });
  });
});

describe("createTemplateSchema", () => {
  it("validates template creation body", () => {
    const result = createTemplateSchema.safeParse({
      name: "My template",
      interviewName: "React mock",
      numOfQuestions: "5",
      interviewType: "technical",
      role: "Frontend Dev",
      experienceLevel: "junior",
    });
    expect(result.success).toBe(true);
    expect(result.data.numOfQuestions).toBe(5);
  });
});

describe("templateService access control", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getTemplateById throws not_found when missing", async () => {
    InterviewTemplate.findById.mockResolvedValue(null);
    await expect(getTemplateById("abc", "user-1")).rejects.toMatchObject({
      code: ERROR_CODES.NOT_FOUND,
    });
  });

  it("getTemplateById throws forbidden for another user's template", async () => {
    InterviewTemplate.findById.mockResolvedValue({
      is_system: false,
      user_id: "other-user",
    });
    await expect(getTemplateById("abc", "user-1")).rejects.toMatchObject({
      code: ERROR_CODES.FORBIDDEN,
    });
  });

  it("createUserTemplate enforces max 10 templates", async () => {
    InterviewTemplate.countDocuments.mockResolvedValue(10);
    await expect(
      createUserTemplate("user-1", {
        name: "T",
        interviewName: "I",
        numOfQuestions: 5,
        interviewType: "mixed",
        role: "Dev",
        experienceLevel: "junior",
      })
    ).rejects.toMatchObject({ code: ERROR_CODES.RATE_LIMITED });
  });

  it("deleteUserTemplate blocks system templates", async () => {
    InterviewTemplate.findById.mockResolvedValue({
      is_system: true,
      user_id: null,
      deleteOne: vi.fn(),
    });
    await expect(deleteUserTemplate("sys-1", "user-1")).rejects.toMatchObject({
      code: ERROR_CODES.FORBIDDEN,
    });
  });
});
