import { describe, it, expect, vi, beforeEach } from "vitest";

const verifyIdToken = vi.fn();

vi.mock("../config/firebase.js", () => ({
  default: {
    auth: () => ({
      verifyIdToken,
    }),
  },
}));

import request from "supertest";
import express from "express";
import { z } from "zod";
import { ERROR_CODES, AppError } from "@prepedge/shared";
import { requestIdMiddleware } from "../middleware/requestId.js";
import { responseEnvelopeMiddleware } from "../middleware/responseEnvelope.js";
import { validate } from "../middleware/validate.js";
import { createRateLimiter } from "../middleware/rateLimit.js";
import firebaseAuthMiddleware from "../middleware/firebaseAuthMiddleware.js";
import { notFoundHandler, errorHandler } from "../middleware/errorHandler.js";

const createTestApp = (router) => {
  const app = express();
  app.use(express.json());
  app.use(requestIdMiddleware);
  app.use(responseEnvelopeMiddleware);
  app.use(router);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};

describe("rate limit middleware", () => {
  it("returns rate_limited envelope when exceeded", async () => {
    const router = express.Router();
    const limiter = createRateLimiter({
      windowMs: 60_000,
      max: 1,
      message: "Too many requests",
    });
    router.get("/limited", limiter, (req, res) => res.success({ ok: true }));

    const app = createTestApp(router);
    const first = await request(app).get("/limited");
    const second = await request(app).get("/limited");

    expect(first.status).toBe(200);
    expect(first.body).toEqual({ data: { ok: true }, error: null });

    expect(second.status).toBe(429);
    expect(second.body).toEqual({
      data: null,
      error: {
        code: ERROR_CODES.RATE_LIMITED,
        message: "Too many requests",
      },
    });
    expect(second.headers["x-request-id"]).toBeDefined();
  });
});

describe("validate middleware", () => {
  it("returns validation_error envelope with field details", async () => {
    const router = express.Router();
    const schema = z.object({
      email: z.string().email(),
      name: z.string().min(1),
    });
    router.post("/validate", validate(schema), (req, res) => res.success(req.validatedBody));

    const app = createTestApp(router);
    const res = await request(app).post("/validate").send({ email: "not-an-email", name: "" });

    expect(res.status).toBe(400);
    expect(res.body.data).toBeNull();
    expect(res.body.error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
    expect(res.body.error.message).toBe("Validation failed");
    expect(res.body.error.details).toBeDefined();
    expect(res.body.error.details.email).toBeDefined();
  });
});

describe("firebase auth middleware", () => {
  beforeEach(() => {
    verifyIdToken.mockReset();
  });

  it("returns unauthorized envelope when token is missing", async () => {
    const router = express.Router();
    router.get("/protected", firebaseAuthMiddleware, (req, res) => res.success({ ok: true }));

    const app = createTestApp(router);
    const res = await request(app).get("/protected");

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      data: null,
      error: {
        code: ERROR_CODES.UNAUTHORIZED,
        message: "Unauthorized: Token missing",
      },
    });
    expect(verifyIdToken).not.toHaveBeenCalled();
  });

  it("returns unauthorized envelope for invalid token", async () => {
    verifyIdToken.mockRejectedValue(new Error("Invalid token"));

    const router = express.Router();
    router.get("/protected", firebaseAuthMiddleware, (req, res) => res.success({ ok: true }));

    const app = createTestApp(router);
    const res = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer invalid-token");

    expect(res.status).toBe(401);
    expect(res.body.data).toBeNull();
    expect(res.body.error.code).toBe(ERROR_CODES.UNAUTHORIZED);
    expect(res.body.error.message).toBe("Unauthorized: Invalid or expired token");
    expect(verifyIdToken).toHaveBeenCalledWith("invalid-token");
  });
});

describe("AppError via error handler", () => {
  it("returns mapped envelope for thrown AppError", async () => {
    const router = express.Router();
    router.get("/fail", (_req, _res, next) => {
      next(AppError.fromCode(ERROR_CODES.FORBIDDEN, "Forbidden"));
    });

    const app = createTestApp(router);
    const res = await request(app).get("/fail");

    expect(res.status).toBe(403);
    expect(res.body).toEqual({
      data: null,
      error: {
        code: ERROR_CODES.FORBIDDEN,
        message: "Forbidden",
      },
    });
  });
});
