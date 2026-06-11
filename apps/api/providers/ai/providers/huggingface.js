import { InferenceClient } from "@huggingface/inference";
import { env } from "../../../config/env.js";

let client = null;

const getClient = () => {
  if (!env.HUGGING_FACE_API_KEY) return null;
  if (!client) client = new InferenceClient(env.HUGGING_FACE_API_KEY);
  return client;
};

export const huggingFaceComplete = async ({ system, user, maxTokens = 500 }) => {
  const hf = getClient();
  if (!hf) throw new Error("Hugging Face not configured");

  const response = await hf.chatCompletion({
    model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
    messages: [
      { role: "system", content: system },
      { role: "user", content: `${user}\n\nRespond with valid JSON only.` },
    ],
    max_tokens: maxTokens,
  });

  return response.choices[0]?.message?.content || "";
};

export const isHuggingFaceAvailable = () => Boolean(env.HUGGING_FACE_API_KEY);
