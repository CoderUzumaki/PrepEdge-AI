import express from "express";
import MockInterview from "../models/MockInterviewModel.js";
const router = express.Router();

// List all or upcoming mock interviews
router.get("/", async (req, res) => {
  try {
    const query = req.query.upcoming ? { scheduledAt: { $gte: new Date() } } : {};
    const interviews = await MockInterview.find(query).sort({ scheduledAt: 1 });
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch interviews" });
  }
});

// Schedule a new mock interview
router.post("/", async (req, res) => {
  try {
    const { scheduledAt, durationMinutes } = req.body;
    const host = req.user?.id || "demo-user";
    const interview = await MockInterview.create({ host, scheduledAt, durationMinutes });
    res.json(interview);
  } catch (err) {
    res.status(500).json({ error: "Failed to schedule interview" });
  }
});

export default router;
