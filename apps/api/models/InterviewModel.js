import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  user_id: { type: String, required: true, index: true },
  interview_name: { type: String, required: true, trim: true },
  num_of_questions: { type: Number, required: true, min: 3, max: 10 },
  interview_type: {
    type: String,
    enum: ["technical", "behavioral", "mixed"],
    required: true,
  },
  role: { type: String, required: true, trim: true },
  experience_level: {
    type: String,
    enum: ["fresher", "junior", "mid", "senior"],
    default: "fresher",
  },
  company_name: { type: String, trim: true },
  company_description: { type: String, trim: true },
  job_description: { type: String, trim: true },
  resume_link: { type: String, trim: true },
  resume_summary: { type: String, trim: true },
  focus_area: { type: String, trim: true },
  status: {
    type: String,
    enum: ["draft", "generating", "ready", "in_progress", "completed"],
    default: "generating",
  },
  current_question_index: { type: Number, default: 0 },
  is_practice: { type: Boolean, default: false },
  questions: [
    {
      question: { type: String, required: true, trim: true },
      preferred_answer: { type: String, required: true, trim: true },
    },
  ],
  schemaVersion: { type: Number, default: 2 },
  created_at: { type: Date, default: Date.now },
});

interviewSchema.index({ user_id: 1, created_at: -1 });

const Interview = mongoose.model("Interview", interviewSchema);
export default Interview;
