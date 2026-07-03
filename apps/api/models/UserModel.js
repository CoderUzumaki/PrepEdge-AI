import mongoose from "mongoose";

const quotaCounterSchema = new mongoose.Schema(
  {
    count: { type: Number, default: 0 },
    period_start: { type: Date, default: () => new Date() },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  firebase_user_id: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  tier: {
    type: String,
    enum: ["basic", "pro", "ultimate"],
    default: "basic",
  },
  preferences: {
    ttsEnabled: { type: Boolean, default: false },
    defaultInterviewType: {
      type: String,
      enum: ["technical", "behavioral", "mixed"],
      default: "mixed",
    },
    defaultExperienceLevel: {
      type: String,
      enum: ["fresher", "junior", "mid", "senior"],
      default: "fresher",
    },
  },
  usage_quotas: {
    interviews_month: { type: quotaCounterSchema, default: () => ({}) },
    practice_day: { type: quotaCounterSchema, default: () => ({}) },
    resume_week: { type: quotaCounterSchema, default: () => ({}) },
    stt_day: { type: quotaCounterSchema, default: () => ({}) },
  },
  schemaVersion: { type: Number, default: 2 },
  is_demo: { type: Boolean, default: false, index: true },
  created_at: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
export default User;
