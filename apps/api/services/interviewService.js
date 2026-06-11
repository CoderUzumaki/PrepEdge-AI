import Interview from "../models/InterviewModel.js";
import Report from "../models/ReportModel.js";
import {
  generateQuestions,
  analyzeAnswer,
  generateInterviewSummary,
  generatePracticeQuestion,
} from "../providers/ai/index.js";
import { AppError } from "../middleware/errorHandler.js";

export const createInterview = async (userId, data, resumeLink, resumeSummary) => {
  const interview = new Interview({
    user_id: userId,
    interview_name: data.interviewName,
    num_of_questions: data.numOfQuestions,
    interview_type: data.interviewType,
    role: data.role,
    experience_level: data.experienceLevel,
    company_name: data.companyName,
    company_description: data.companyDescription,
    job_description: data.jobDescription,
    focus_area: data.focusAt,
    resume_link: resumeLink,
    resume_summary: resumeSummary,
    status: "generating",
    questions: [],
  });
  await interview.save();

  generateQuestionsAsync(interview._id.toString());
  return interview;
};

const generateQuestionsAsync = async (interviewId) => {
  try {
    const interview = await Interview.findById(interviewId);
    if (!interview) return;

    const questions = await generateQuestions({
      num_of_questions: interview.num_of_questions,
      interview_type: interview.interview_type,
      role: interview.role,
      experience_level: interview.experience_level,
      company_name: interview.company_name,
      company_description: interview.company_description,
      job_description: interview.job_description,
      focus_area: interview.focus_area,
      resume_summary: interview.resume_summary,
    });

    interview.questions = questions;
    interview.status = "ready";
    await interview.save();
  } catch (err) {
    console.error("Question generation failed:", err);
    await Interview.findByIdAndUpdate(interviewId, { status: "draft" });
  }
};

export const createPracticeInterview = async (userId, data) => {
  const question = await generatePracticeQuestion({
    role: data.role,
    experienceLevel: data.experienceLevel,
    interviewType: data.interviewType,
    topic: data.topic,
  });

  if (!question) throw new AppError("Failed to generate practice question", 500);

  const interview = new Interview({
    user_id: userId,
    interview_name: `Practice: ${data.topic || data.role}`,
    num_of_questions: 1,
    interview_type: data.interviewType,
    role: data.role,
    experience_level: data.experienceLevel,
    status: "ready",
    is_practice: true,
    questions: [question],
  });
  await interview.save();
  return interview;
};

export const getInterviewById = async (id) => {
  const interview = await Interview.findById(id);
  if (!interview) throw new AppError("Interview not found", 404);
  return interview;
};

export const listUserInterviews = async (userId) =>
  Interview.find({ user_id: userId }).sort({ created_at: -1 });

export const updateInterviewProgress = async (interview, updates) => {
  if (updates.currentQuestionIndex !== undefined) {
    interview.current_question_index = updates.currentQuestionIndex;
  }
  if (updates.status) {
    interview.status = updates.status;
  }
  await interview.save();
  return interview;
};

export const submitAnswer = async (interview, questionIndex, answer) => {
  const question = interview.questions[questionIndex];
  if (!question) throw new AppError("Invalid question index", 400);

  let report = await Report.findOne({ interviewId: interview._id });
  if (!report) {
    report = new Report({
      interviewId: interview._id,
      userId: interview.user_id,
      answers: [],
    });
  }

  const existing = report.answers.find((a) => a.question === question.question);
  if (existing) {
    existing.userAnswer = answer;
    existing.scoringStatus = "pending";
    existing.score = null;
    existing.feedback = null;
  } else {
    report.answers.push({
      question: question.question,
      userAnswer: answer,
      preferredAnswer: question.preferred_answer,
      scoringStatus: "pending",
    });
  }

  await report.save();

  if (interview.status !== "completed") {
    interview.status = "in_progress";
    interview.current_question_index = questionIndex;
    await interview.save();
  }

  scoreAnswerAsync(interview, report._id.toString(), questionIndex, answer);

  return report;
};

const scoreAnswerAsync = async (interview, reportId, questionIndex, answer) => {
  const question = interview.questions[questionIndex];
  try {
    const result = await analyzeAnswer({
      question: question.question,
      userAnswer: answer,
      preferredAnswer: question.preferred_answer,
      role: interview.role,
      experience_level: interview.experience_level,
      interview_type: interview.interview_type,
    });

    const report = await Report.findById(reportId);
    const answerEntry = report.answers.find((a) => a.question === question.question);
    if (answerEntry) {
      answerEntry.score = result.score;
      answerEntry.feedback = result.feedback;
      answerEntry.tags = result.tags;
      answerEntry.scoringStatus = "scored";
      answerEntry.scoredAt = new Date();
    }

    const allSubmitted = report.answers.length >= interview.num_of_questions;
    const allScored = report.answers.every((a) => a.scoringStatus === "scored");

    if (allSubmitted && allScored) {
      await finalizeReport(interview, report);
    } else {
      await report.save();
    }
  } catch (err) {
    console.error("Answer scoring failed:", err);
    const report = await Report.findById(reportId);
    const answerEntry = report?.answers.find((a) => a.question === question.question);
    if (answerEntry) {
      answerEntry.scoringStatus = "failed";
      answerEntry.feedback = "Scoring failed. Please retry.";
      await report.save();
    }
  }
};

const finalizeReport = async (interview, report) => {
  report.summaryStatus = "generating";
  await report.save();

  const scoredAnswers = report.answers.filter((a) => a.scoringStatus === "scored");
  const avgScore =
    scoredAnswers.reduce((sum, a) => sum + a.score, 0) / scoredAnswers.length;

  report.finalScore = Number(avgScore.toFixed(2));

  try {
    const combinedFeedback = scoredAnswers
      .map((a) => `Q: ${a.question}\nScore: ${a.score}\nFeedback: ${a.feedback}`)
      .join("\n\n");

    const summary = await generateInterviewSummary(combinedFeedback);
    report.summary = summary.summary;
    report.strengths = summary.strengths;
    report.areaOfImprovement = summary.areaOfImprovement;
    report.summaryStatus = "completed";
  } catch (err) {
    console.error("Summary generation failed:", err);
    report.summaryStatus = "failed";
    report.summary = "Summary could not be generated.";
  }

  interview.status = "completed";
  await Promise.all([report.save(), interview.save()]);
};

export const getScoringStatus = async (interviewId) => {
  const report = await Report.findOne({ interviewId });
  if (!report) {
    return { answers: [], summaryStatus: "pending", finalScore: null };
  }

  return {
    answers: report.answers.map((a) => ({
      question: a.question,
      scoringStatus: a.scoringStatus,
      score: a.score,
      feedback: a.feedback,
      tags: a.tags,
    })),
    summaryStatus: report.summaryStatus,
    finalScore: report.finalScore,
    isComplete: report.summaryStatus === "completed",
  };
};

export const getDashboardAnalytics = async (userId) => {
  const reports = await Report.find({ userId, finalScore: { $ne: null } })
    .populate("interviewId")
    .sort({ createdAt: -1 });

  const scores = reports.map((r) => ({
    date: r.createdAt,
    score: r.finalScore,
    interviewName: r.interviewId?.interview_name,
    type: r.interviewId?.interview_type,
  }));

  const tagCounts = {};
  reports.forEach((r) => {
    r.answers.forEach((a) => {
      (a.tags || []).forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
  });

  const weakestTopics = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic, count]) => ({ topic, count }));

  const byType = { technical: [], behavioral: [], mixed: [] };
  reports.forEach((r) => {
    const type = r.interviewId?.interview_type;
    if (type && byType[type]) byType[type].push(r.finalScore);
  });

  const typeBreakdown = Object.fromEntries(
    Object.entries(byType).map(([type, arr]) => [
      type,
      arr.length ? Number((arr.reduce((s, v) => s + v, 0) / arr.length).toFixed(1)) : null,
    ])
  );

  const lastThree = reports.slice(0, 3).map((r) => ({
    id: r.interviewId?._id,
    name: r.interviewId?.interview_name,
    score: r.finalScore,
    date: r.createdAt,
    type: r.interviewId?.interview_type,
  }));

  return { scores, weakestTopics, typeBreakdown, lastThree, totalInterviews: reports.length };
};
