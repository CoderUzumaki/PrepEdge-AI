import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Interview",
    required: true,
    index: true,
  },
  userId: { type: String, required: true },
  answers: [
    {
      question: String,
      userAnswer: String,
      preferredAnswer: String,
      score: { type: Number, default: null },
      feedback: { type: String, default: null },
      scoringStatus: {
        type: String,
        enum: ["pending", "scored", "failed"],
        default: "pending",
      },
      tags: [String],
      speechMetrics: {
        wordCount: Number,
        fillerCount: Number,
        wordsPerMinute: Number,
        durationSeconds: Number,
        fillerWords: [String],
      },
      rawAiResponse: String,
      scoredAt: Date,
    },
  ],
  finalScore: Number,
  summary: String,
  areaOfImprovement: String,
  strengths: String,
  summaryStatus: {
    type: String,
    enum: ["pending", "generating", "completed", "failed"],
    default: "pending",
  },
  schemaVersion: { type: Number, default: 2 },
  createdAt: { type: Date, default: Date.now },
});

const Report = mongoose.model("Report", reportSchema);
export default Report;
