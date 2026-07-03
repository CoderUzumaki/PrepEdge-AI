/**
 * @module services/resumeService
 * @description Resume parsing cache and AI summarization.
 */

import ResumeCache from "../models/ResumeCacheModel.js";
import { summarizeResume } from "../providers/ai/index.js";
import { hashBuffer } from "../utils/hash.js";

/**
 * Returns a cached resume summary or generates and caches a new one (7-day TTL).
 * @param {Buffer} buffer - Raw PDF buffer
 * @param {string} text - Extracted plain text (max ~4000 chars)
 * @returns {Promise<string>}
 */
export const getOrCreateResumeSummary = async (buffer, text) => {
  const fileHash = hashBuffer(buffer);
  const cached = await ResumeCache.findOne({ fileHash, expiresAt: { $gt: new Date() } });
  if (cached) return cached.summary;

  const summary = await summarizeResume(text);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await ResumeCache.findOneAndUpdate(
    { fileHash },
    { summary, expiresAt },
    { upsert: true, new: true }
  );

  return summary;
};
