/**
 * @module services/speechService
 * @description Speech-to-text orchestration with per-user STT quota enforcement.
 */

import { transcribeAudio } from "../providers/stt/groqWhisper.js";
import { checkAndIncrementStt } from "./quotaService.js";
import { log } from "../utils/logger.js";

/**
 * Transcribes audio for an authenticated user and consumes STT quota.
 * @param {import("../models/UserModel.js").default} user
 * @param {Buffer} audioBuffer
 * @param {string} mimeType
 * @param {string|null} [requestId]
 * @returns {Promise<{ text: string, durationMs: number }>}
 */
export const transcribe = async (user, audioBuffer, mimeType, requestId = null) => {
  const start = Date.now();

  await checkAndIncrementStt(user);

  const result = await transcribeAudio(audioBuffer, mimeType, requestId);

  log("info", "Speech transcribed", {
    requestId,
    module: "speechService",
    route: "POST /api/speech/transcribe",
    durationMs: Date.now() - start,
    audioBytes: audioBuffer.length,
    textLength: result.text.length,
  });

  return result;
};
