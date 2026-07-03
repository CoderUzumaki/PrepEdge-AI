import mongoose from "mongoose";

const interviewTemplateSchema = new mongoose.Schema({
  user_id: { type: String, default: null, index: true },
  is_system: { type: Boolean, default: false, index: true },
  name: { type: String, required: true, trim: true },
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
    required: true,
  },
  company_name: { type: String, trim: true, default: "" },
  company_description: { type: String, trim: true, default: "" },
  job_description: { type: String, trim: true, default: "" },
  focus_area: { type: String, trim: true, default: "" },
  schemaVersion: { type: Number, default: 2 },
  created_at: { type: Date, default: Date.now },
});

interviewTemplateSchema.index({ user_id: 1, name: 1 }, { unique: true, partialFilterExpression: { is_system: false } });

const InterviewTemplate = mongoose.model("InterviewTemplate", interviewTemplateSchema);
export default InterviewTemplate;
