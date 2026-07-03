/**
 * @module services/demoService
 * @description Demo account seeding, sample question scoring, and magic-link sessions.
 */

import admin from "../config/firebase.js";
import User from "../models/UserModel.js";
import Interview from "../models/InterviewModel.js";
import Report from "../models/ReportModel.js";
import { env } from "../config/env.js";
import { SAMPLE_QUESTION } from "@prepedge/shared";
import { analyzeAnswer } from "../providers/ai/index.js";
import { assertSafeForAi } from "@prepedge/shared";

export const DEMO_FIREBASE_UID =
  env.DEMO_FIREBASE_UID || "prepedge-demo-readonly";
const DEMO_EMAIL = "demo@prepedge.ai";

const SEEDED_INTERVIEWS = [
  {
    interview_name: "Google SWE — Technical",
    role: "Software Engineer",
    experience_level: "mid",
    interview_type: "technical",
    num_of_questions: 5,
    finalScore: 78,
    summary:
      "Solid technical fundamentals with room to improve on system design depth and concise communication.",
    strengths: "Strong problem-solving, clear coding explanations, good grasp of data structures.",
    areaOfImprovement: "Practice structuring system design answers; reduce filler words in voice responses.",
    answers: [
      {
        question: "Explain how a hash map works internally.",
        userAnswer: "A hash map uses a hash function to map keys to buckets...",
        preferredAnswer: "Cover hashing, collisions, chaining vs open addressing.",
        score: 85,
        feedback: "Clear explanation of collision handling.",
        tags: ["data-structures", "strong"],
        speechMetrics: { wordCount: 120, fillerCount: 1, wordsPerMinute: 130, durationSeconds: 55 },
      },
      {
        question: "Design a URL shortener.",
        userAnswer: "I'd use a key-value store for mappings and a counter for IDs...",
        preferredAnswer: "Discuss encoding, DB schema, caching, and scale.",
        score: 72,
        feedback: "Good start; expand on caching and read/write ratio.",
        tags: ["system-design", "improve"],
        speechMetrics: { wordCount: 95, fillerCount: 4, wordsPerMinute: 110, durationSeconds: 52 },
      },
    ],
  },
  {
    interview_name: "Meta — Behavioral",
    role: "Software Engineer",
    experience_level: "mid",
    interview_type: "behavioral",
    num_of_questions: 4,
    finalScore: 82,
    summary: "Strong behavioral examples with measurable impact. Continue refining STAR structure.",
    strengths: "Leadership examples, conflict resolution, ownership mindset.",
    areaOfImprovement: "Add more quantified outcomes to project stories.",
    answers: [
      {
        question: "Tell me about a conflict with a teammate.",
        userAnswer: "During a sprint, we disagreed on API design. I scheduled a sync...",
        preferredAnswer: "STAR format with resolution and learning.",
        score: 88,
        feedback: "Excellent conflict resolution narrative.",
        tags: ["behavioral", "strong"],
        speechMetrics: { wordCount: 140, fillerCount: 2, wordsPerMinute: 125, durationSeconds: 67 },
      },
    ],
  },
  {
    interview_name: "Startup — Full Stack",
    role: "Full Stack Developer",
    experience_level: "junior",
    interview_type: "mixed",
    num_of_questions: 5,
    finalScore: 74,
    summary: "Good full-stack awareness; deepen backend debugging and testing practices.",
    strengths: "React proficiency, API integration, quick learner.",
    areaOfImprovement: "Practice explaining database indexing and test strategies.",
    answers: [
      {
        question: "How do you handle state in a React application?",
        userAnswer: "For local UI state I use useState; for shared state Context or Zustand...",
        preferredAnswer: "Compare local, context, and external stores with trade-offs.",
        score: 80,
        feedback: "Practical answer with sensible library choices.",
        tags: ["react", "strong"],
        speechMetrics: { wordCount: 88, fillerCount: 3, wordsPerMinute: 115, durationSeconds: 46 },
      },
    ],
  },
];

/**
 * Ensures the Firebase demo user exists for custom-token sign-in.
 */
export const ensureDemoFirebaseUser = async () => {
  try {
    await admin.auth().getUser(DEMO_FIREBASE_UID);
  } catch (err) {
    if (err.code === "auth/user-not-found") {
      await admin.auth().createUser({
        uid: DEMO_FIREBASE_UID,
        email: DEMO_EMAIL,
        displayName: "Demo Candidate",
        emailVerified: true,
      });
    } else {
      throw err;
    }
  }
};

/**
 * Seeds read-only demo MongoDB data (interviews + reports).
 */
export const seedDemoAccount = async () => {
  await ensureDemoFirebaseUser();

  let user = await User.findOne({ firebase_user_id: DEMO_FIREBASE_UID });
  if (!user) {
    user = new User({
      firebase_user_id: DEMO_FIREBASE_UID,
      email: DEMO_EMAIL,
      name: "Demo Candidate",
      is_demo: true,
    });
    await user.save();
  } else if (!user.is_demo) {
    user.is_demo = true;
    await user.save();
  }

  const userId = user._id.toString();
  const existing = await Interview.countDocuments({ user_id: userId });
  if (existing >= SEEDED_INTERVIEWS.length) return user;

  for (const seed of SEEDED_INTERVIEWS) {
    const found = await Interview.findOne({
      user_id: userId,
      interview_name: seed.interview_name,
    });
    if (found) continue;

    const interview = await Interview.create({
      user_id: userId,
      interview_name: seed.interview_name,
      role: seed.role,
      experience_level: seed.experience_level,
      interview_type: seed.interview_type,
      num_of_questions: seed.num_of_questions,
      status: "completed",
      current_question_index: seed.num_of_questions,
      questions: seed.answers.map((a) => ({
        question: a.question,
        preferred_answer: a.preferredAnswer,
      })),
    });

    await Report.create({
      interviewId: interview._id,
      userId,
      finalScore: seed.finalScore,
      summary: seed.summary,
      strengths: seed.strengths,
      areaOfImprovement: seed.areaOfImprovement,
      summaryStatus: "completed",
      answers: seed.answers.map((a) => ({
        question: a.question,
        userAnswer: a.userAnswer,
        preferredAnswer: a.preferredAnswer,
        score: a.score,
        feedback: a.feedback,
        tags: a.tags,
        scoringStatus: "scored",
        speechMetrics: a.speechMetrics,
        scoredAt: new Date(),
      })),
    });
  }

  return user;
};

/**
 * @returns {Promise<{ customToken: string }>}
 */
export const createDemoSession = async () => {
  await seedDemoAccount();
  const customToken = await admin.auth().createCustomToken(DEMO_FIREBASE_UID);
  return { customToken };
};

/**
 * @returns {typeof SAMPLE_QUESTION}
 */
export const getSampleQuestion = () => ({
  question: SAMPLE_QUESTION.question,
  role: SAMPLE_QUESTION.role,
  experienceLevel: SAMPLE_QUESTION.experienceLevel,
  interviewType: SAMPLE_QUESTION.interviewType,
});

/**
 * @param {string} answer
 */
export const scoreSampleAnswer = async (answer) => {
  const safeAnswer = assertSafeForAi(answer, { field: "user_answer", label: "answer" });

  try {
    const result = await analyzeAnswer({
      question: SAMPLE_QUESTION.question,
      preferredAnswer: SAMPLE_QUESTION.preferredAnswer,
      userAnswer: safeAnswer,
      role: SAMPLE_QUESTION.role,
      experienceLevel: SAMPLE_QUESTION.experienceLevel,
    });
    return {
      score: result.score,
      feedback: result.feedback,
      tags: result.tags,
      source: "ai",
    };
  } catch {
    const wordCount = safeAnswer.trim().split(/\s+/).filter(Boolean).length;
    const score = Math.min(88, 45 + Math.min(wordCount * 2, 35));
    return {
      score,
      feedback:
        wordCount < 30
          ? "Good start — try expanding with a specific example using the STAR format (Situation, Task, Action, Result)."
          : "Solid sample response. Sign up to get full AI-powered feedback on personalized interview questions.",
      tags: ["demo", "sample"],
      source: "heuristic",
    };
  }
};
