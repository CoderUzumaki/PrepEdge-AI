import { describe, it, expect } from "vitest";
import { ANALYTICS_EVENTS, ANALYTICS_EVENT_NAMES } from "@prepedge/shared";

describe("ANALYTICS_EVENTS", () => {
  it("defines the four M8 custom event names", () => {
    expect(ANALYTICS_EVENT_NAMES).toEqual([
      "signup",
      "interview_complete",
      "pdf_download",
      "demo_click",
    ]);
  });

  it("exposes stable event keys", () => {
    expect(ANALYTICS_EVENTS.SIGNUP).toBe("signup");
    expect(ANALYTICS_EVENTS.DEMO_CLICK).toBe("demo_click");
  });
});
