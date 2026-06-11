import { describe, it, expect } from "vitest";
import { interviewSetupSchema, submitAnswerSchema, contactSchema } from "@prepedge/shared";

describe("shared schemas", () => {
  it("validates interview setup", () => {
    const result = interviewSetupSchema.safeParse({
      interviewName: "Test",
      numOfQuestions: "5",
      interviewType: "technical",
      role: "Engineer",
      experienceLevel: "junior",
    });
    expect(result.success).toBe(true);
    expect(result.data.numOfQuestions).toBe(5);
  });

  it("rejects invalid interview type", () => {
    const result = interviewSetupSchema.safeParse({
      interviewName: "Test",
      numOfQuestions: 5,
      interviewType: "invalid",
      role: "Engineer",
      experienceLevel: "junior",
    });
    expect(result.success).toBe(false);
  });

  it("validates answer submission", () => {
    const result = submitAnswerSchema.safeParse({
      questionIndex: "0",
      answer: "My answer",
    });
    expect(result.success).toBe(true);
  });

  it("validates contact form", () => {
    const result = contactSchema.safeParse({
      name: "John",
      email: "john@example.com",
      subject: "Help",
      category: "Support",
      message: "I need help with my account please",
    });
    expect(result.success).toBe(true);
  });
});
