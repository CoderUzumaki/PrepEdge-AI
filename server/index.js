/*
 * @license MIT License
 * Copyright (c) 2025 Abhinav Mishra
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import multer from "multer";

// Import Firebase Admin instance (already initialized in firebase.js)
import admin from "./firebase.js"; 

// Load environment variables
dotenv.config();

const app = express();
const upload = multer({ dest: "uploads/" });

// --- Middlewares ---
app.use(cors({
  origin: 'https://prepedgeai.vercel.app',
  credentials: true,
}));
app.use(express.json());

// --- Protected route middleware ---
app.use("/api/protected", async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// --- Connect to database ---
connectDB()
  .then(() => console.log("Database connected successfully"))
  .catch((error) => console.error("Database connection failed:", error));

// --- Routes ---
import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/contact", contactRoutes);

// --- Start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
