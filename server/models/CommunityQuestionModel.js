import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  user: { type: String, required: true }, // user id
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const questionSchema = new mongoose.Schema({
  user: { type: String, required: true }, // user id
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  answers: [answerSchema],
  createdAt: { type: Date, default: Date.now },
});

const CommunityQuestion = mongoose.model("CommunityQuestion", questionSchema);
export default CommunityQuestion;
