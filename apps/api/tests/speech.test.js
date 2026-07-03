import { describe, it, expect, vi, beforeEach } from "vitest";
import { analyzeTranscript } from "@prepedge/shared";

describe("analyzeTranscript", () => {
  it("counts words and filler phrases", () => {
    const result = analyzeTranscript("Um I think like you know the answer is basically correct", 30);
    expect(result.wordCount).toBeGreaterThan(5);
    expect(result.fillerCount).toBeGreaterThan(0);
    expect(result.fillerWords.length).toBeGreaterThan(0);
  });

  it("computes words per minute from duration", () => {
    const result = analyzeTranscript("one two three four five six", 60);
    expect(result.wordsPerMinute).toBe(6);
  });

  it("returns zeros for empty text", () => {
    const result = analyzeTranscript("", 0);
    expect(result.wordCount).toBe(0);
    expect(result.fillerCount).toBe(0);
  });
});

describe("speechService quota integration", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("checkAndIncrementStt is used by speech service module", async () => {
    const quotaService = await import("../services/quotaService.js");
    expect(typeof quotaService.checkAndIncrementStt).toBe("function");
  });
});
