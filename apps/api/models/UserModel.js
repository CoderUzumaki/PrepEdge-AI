import mongoose from "mongoose";

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
  schemaVersion: { type: Number, default: 2 },
  created_at: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
export default User;
