import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../../../config/env.js";

let client = null;

const getClient = () => {
  if (!env.GEMINI_API_KEY) return null;
  if (!client) client = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  return client;
};

export const geminiComplete = async ({ system, user, maxTokens = 500 }) => {
  const genAI = getClient();
  if (!genAI) throw new Error("Gemini not configured");

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature: 0.3,
      responseMimeType: "application/json",
    },
    systemInstruction: system,
  });

  const result = await model.generateContent(user);
  return result.response.text();
};

export const isGeminiAvailable = () => Boolean(env.GEMINI_API_KEY);
