import mongoose from "mongoose";

const mockInterviewSchema = new mongoose.Schema({
  host: { type: String, required: true }, // user id
  participants: [{ type: String }], // user ids
  scheduledAt: { type: Date, required: true },
  durationMinutes: { type: Number, default: 30 },
  status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
  createdAt: { type: Date, default: Date.now },
  meetingLink: { type: String },
  notes: { type: String },
});

const MockInterview = mongoose.model("MockInterview", mockInterviewSchema);
export default MockInterview;
