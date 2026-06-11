import Groq from "groq-sdk";
import { env } from "../../../config/env.js";

let client = null;

const getClient = () => {
  if (!env.GROQ_API_KEY) return null;
  if (!client) client = new Groq({ apiKey: env.GROQ_API_KEY });
  return client;
};

export const groqComplete = async ({ system, user, maxTokens = 500 }) => {
  const groq = getClient();
  if (!groq) throw new Error("Groq not configured");

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    max_tokens: maxTokens,
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  return response.choices[0]?.message?.content || "";
};

export const isGroqAvailable = () => Boolean(env.GROQ_API_KEY);
