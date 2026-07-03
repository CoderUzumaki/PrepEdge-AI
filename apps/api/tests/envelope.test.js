import { describe, it, expect } from "vitest";
import {
  AppError,
  ERROR_CODES,
  ERROR_HTTP_STATUS,
  successEnvelope,
  failEnvelope,
} from "@prepedge/shared";

describe("error codes", () => {
  it("maps stable codes to HTTP statuses", () => {
    expect(ERROR_HTTP_STATUS[ERROR_CODES.UNAUTHORIZED]).toBe(401);
    expect(ERROR_HTTP_STATUS[ERROR_CODES.VALIDATION_ERROR]).toBe(400);
    expect(ERROR_HTTP_STATUS[ERROR_CODES.RATE_LIMITED]).toBe(429);
    expect(ERROR_HTTP_STATUS[ERROR_CODES.UPSTREAM_FAILURE]).toBe(502);
  });
});

describe("envelope helpers", () => {
  it("builds success envelope", () => {
    expect(successEnvelope({ ok: true })).toEqual({
      data: { ok: true },
      error: null,
    });
  });

  it("builds failure envelope with optional details", () => {
    expect(failEnvelope("validation_error", "Validation failed", { field: ["required"] })).toEqual({
      data: null,
      error: {
        code: "validation_error",
        message: "Validation failed",
        details: { field: ["required"] },
      },
    });
  });
});

describe("AppError", () => {
  it("exposes httpStatus from code", () => {
    const err = AppError.fromCode(ERROR_CODES.NOT_FOUND, "Interview not found");
    expect(err.httpStatus).toBe(404);
    expect(err.code).toBe("not_found");
    expect(err.message).toBe("Interview not found");
  });

  it("maps legacy status codes", () => {
    const err = AppError.fromStatus(403, "Forbidden");
    expect(err.code).toBe("forbidden");
    expect(err.httpStatus).toBe(403);
  });
});
