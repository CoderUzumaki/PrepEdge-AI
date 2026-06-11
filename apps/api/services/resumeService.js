import ResumeCache from "../models/ResumeCacheModel.js";
import { summarizeResume } from "../providers/ai/index.js";
import { hashBuffer } from "../utils/hash.js";

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
