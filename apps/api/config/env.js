import { cleanEnv, port, str, url } from "envalid";
import dotenv from "dotenv";

dotenv.config();

const isTest = process.env.NODE_ENV === "test" || process.env.VITEST;

export const env = isTest
  ? {
      PORT: 5000,
      NODE_ENV: "test",
      MONGO_URI: "mongodb://localhost:27017/prepedge-test",
      FIREBASE_SERVICE_ACCOUNT: "{}",
      GROQ_API_KEY: "",
      GEMINI_API_KEY: "",
      HUGGING_FACE_API_KEY: "",
      CLOUDINARY_CLOUD_NAME: "",
      CLOUDINARY_API_KEY: "",
      CLOUDINARY_API_SECRET: "",
      EMAIL_USER: "",
      EMAIL_PASS: "",
      EMAIL_RECEIVER: "",
      DEMO_FIREBASE_UID: "",
      ALLOWED_ORIGINS: "http://localhost:5173",
    }
  : cleanEnv(process.env, {
  PORT: port({ default: 5000 }),
  NODE_ENV: str({ choices: ["development", "production", "test"], default: "development" }),
  MONGO_URI: url(),
  FIREBASE_SERVICE_ACCOUNT: str(),
  GROQ_API_KEY: str({ default: "" }),
  GEMINI_API_KEY: str({ default: "" }),
  HUGGING_FACE_API_KEY: str({ default: "" }),
  CLOUDINARY_CLOUD_NAME: str({ default: "" }),
  CLOUDINARY_API_KEY: str({ default: "" }),
  CLOUDINARY_API_SECRET: str({ default: "" }),
  EMAIL_USER: str({ default: "" }),
  EMAIL_PASS: str({ default: "" }),
  EMAIL_RECEIVER: str({ default: "" }),
  ALLOWED_ORIGINS: str({ default: "http://localhost:5173,https://prepedgeai.vercel.app" }),
  DEMO_FIREBASE_UID: str({ default: "" }),
});

export const allowedOrigins = env.ALLOWED_ORIGINS.split(",")
  .map((o) => o.trim())
  .filter(Boolean);
