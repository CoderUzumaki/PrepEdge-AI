import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import healthRoutes from "../routes/healthRoutes.js";
import { notFoundHandler, errorHandler } from "../middleware/errorHandler.js";

const createTestApp = () => {
  const app = express();
  app.use("/api/health", healthRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};

describe("health endpoint", () => {
  it("returns ok status", async () => {
    const app = createTestApp();
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.version).toBe("2.0.0");
    expect(res.body).toHaveProperty("uptime");
    expect(res.body).toHaveProperty("timestamp");
  });
});
