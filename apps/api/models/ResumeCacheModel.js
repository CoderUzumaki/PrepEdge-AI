import mongoose from "mongoose";

const resumeCacheSchema = new mongoose.Schema({
  fileHash: { type: String, required: true, unique: true, index: true },
  summary: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

resumeCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const ResumeCache = mongoose.model("ResumeCache", resumeCacheSchema);
export default ResumeCache;
