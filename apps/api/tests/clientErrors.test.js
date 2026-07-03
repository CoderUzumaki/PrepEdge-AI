import { describe, it, expect } from "vitest";
import {
  normalizeApiError,
  formatValidationDetails,
  ApiError,
} from "../../web/src/lib/api/errors.js";

describe("normalizeApiError", () => {
  it("parses full envelope error objects", () => {
    expect(
      normalizeApiError(
        { data: null, error: { code: "not_found", message: "Missing" } },
        404
      )
    ).toEqual({ code: "not_found", message: "Missing" });
  });

  it("parses legacy string error field with status mapping", () => {
    expect(normalizeApiError({ error: "Too many requests" }, 429)).toEqual({
      code: "rate_limited",
      message: "Too many requests",
    });
  });

  it("maps bare HTTP status to stable codes", () => {
    expect(normalizeApiError({}, 401)).toEqual({
      code: "unauthorized",
      message: "Request failed",
    });
  });
});

describe("formatValidationDetails", () => {
  it("joins field errors into readable text", () => {
    expect(
      formatValidationDetails({
        email: ["Invalid email"],
        name: ["Required"],
      })
    ).toBe("email: Invalid email; name: Required");
  });
});

describe("ApiError.fromAxios", () => {
  it("handles network failures without a response", () => {
    const err = ApiError.fromAxios({ message: "Network Error" });
    expect(err.code).toBe("internal_error");
    expect(err.message).toBe("Network Error");
  });
});
