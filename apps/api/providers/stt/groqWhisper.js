/**
 * @module providers/stt/groqWhisper
 * @description Groq Whisper Large v3 Turbo transcription (server-side proxy).
 */

import Groq, { toFile } from "groq-sdk";
import { env } from "../../config/env.js";
import { AppError, ERROR_CODES } from "@prepedge/shared";

const MAX_BYTES = 25 * 1024 * 1024;
const MODEL = "whisper-large-v3-turbo";

let client = null;

const getClient = () => {
  if (!env.GROQ_API_KEY) return null;
  if (!client) client = new Groq({ apiKey: env.GROQ_API_KEY });
  return client;
};

/**
 * Transcribes an audio buffer via Groq Whisper.
 * @param {Buffer} audioBuffer - Raw audio (webm/wav, max 25 MB)
 * @param {string} [mimeType]
 * @param {string} [requestId]
 * @returns {Promise<{ text: string, durationMs: number }>}
 */
export const transcribeAudio = async (audioBuffer, mimeType = "audio/webm", requestId = null) => {
  const groq = getClient();
  if (!groq) {
    throw AppError.fromCode(ERROR_CODES.UPSTREAM_FAILURE, "Speech transcription is not configured.");
  }

  if (!audioBuffer?.length) {
    throw AppError.fromCode(ERROR_CODES.VALIDATION_ERROR, "Audio file is empty.");
  }

  if (audioBuffer.length > MAX_BYTES) {
    throw AppError.fromCode(ERROR_CODES.VALIDATION_ERROR, "Audio file exceeds 25 MB limit.");
  }

  const ext = mimeType.includes("wav") ? "wav" : "webm";
  const start = Date.now();

  try {
    const file = await toFile(audioBuffer, `audio.${ext}`, { type: mimeType });
    const result = await groq.audio.transcriptions.create({
      file,
      model: MODEL,
      language: "en",
      response_format: "json",
      temperature: 0,
    });

    return {
      text: (result.text || "").trim(),
      durationMs: Date.now() - start,
      requestId,
    };
  } catch (err) {
    throw AppError.fromCode(
      ERROR_CODES.UPSTREAM_FAILURE,
      "Speech transcription failed. Try again or type your answer.",
      { cause: err.message }
    );
  }
};

export const isGroqSttAvailable = () => Boolean(env.GROQ_API_KEY);
