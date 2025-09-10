import express from "express";
import CommunityQuestion from "../models/CommunityQuestionModel.js";
const router = express.Router();

// List all questions
router.get("/", async (req, res) => {
  try {
    const questions = await CommunityQuestion.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// Post a new question
router.post("/", async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const user = req.user?.id || "demo-user";
    const question = await CommunityQuestion.create({ user, title, content, tags });
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: "Failed to post question" });
  }
});

export default router;
