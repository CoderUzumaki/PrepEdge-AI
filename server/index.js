/*
 * @license MIT License
 * Copyright (c) 2025 Abhinav Mishra
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import admin from "firebase-admin";
import multer from "multer";

dotenv.config();
const app = express();
const upload = multer({ dest: "uploads/" });
app.use(cors({
  origin: 'https://prepedgeai.vercel.app',
  credentials: true,
}));
app.use(express.json());
connectDB()
    .then(() => console.log("Database connected successfully"))
    .catch((error) => console.error("Database connection failed:", error));
    
// Initializing Firebase Admin SDK
// var serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT.replace(/\\n/g, '\n'));   
import fs from 'fs';
const serviceAccount = JSON.parse(fs.readFileSync('./config/firebaseServiceAccountKey.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Routing
import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/contact", contactRoutes);

// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
