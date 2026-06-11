import { describe, it, expect } from "vitest";
import { parseJsonResponse, normalizeAiText } from "../providers/ai/parseJson.js";

describe("parseJsonResponse", () => {
  it("parses clean JSON", () => {
    const result = parseJsonResponse('{"score":85,"feedback":"Good"}');
    expect(result.score).toBe(85);
  });

  it("extracts JSON from markdown fences", () => {
    const result = parseJsonResponse('Here is the result:\n```json\n{"score":70}\n```');
    expect(result.score).toBe(70);
  });

  it("throws when no JSON found", () => {
    expect(() => parseJsonResponse("no json here")).toThrow();
  });
});

describe("normalizeAiText", () => {
  it("joins arrays into newline-separated text", () => {
    expect(normalizeAiText(["strength one", "strength two"])).toBe(
      "strength one\nstrength two"
    );
  });

  it("stringifies objects", () => {
    expect(normalizeAiText({ Education: ["MIT"] })).toContain("Education");
  });
});
