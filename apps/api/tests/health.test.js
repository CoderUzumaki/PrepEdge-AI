import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import healthRoutes from "../routes/healthRoutes.js";
import { requestIdMiddleware } from "../middleware/requestId.js";
import { responseEnvelopeMiddleware } from "../middleware/responseEnvelope.js";
import { notFoundHandler, errorHandler } from "../middleware/errorHandler.js";

const createTestApp = () => {
  const app = express();
  app.use(requestIdMiddleware);
  app.use(responseEnvelopeMiddleware);
  app.use("/api/health", healthRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};

describe("health endpoint", () => {
  it("returns envelope with ok status", async () => {
    const app = createTestApp();
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.headers["x-request-id"]).toBeDefined();
    expect(res.body).toEqual({
      data: {
        status: "ok",
        version: "2.0.0",
        uptime: expect.any(Number),
        timestamp: expect.any(String),
      },
      error: null,
    });
  });
});

describe("not found handler", () => {
  it("returns not_found envelope", async () => {
    const app = createTestApp();
    const res = await request(app).get("/api/missing");
    expect(res.status).toBe(404);
    expect(res.body.data).toBeNull();
    expect(res.body.error.code).toBe("not_found");
    expect(res.headers["x-request-id"]).toBeDefined();
  });
});
