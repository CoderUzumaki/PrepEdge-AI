import { AI_TASKS } from "@prepedge/shared";

const SYSTEM_PROMPTS = {
  [AI_TASKS.SUMMARIZE_RESUME]: `You are an expert resume reviewer. Extract structured info and return valid JSON only.`,
  [AI_TASKS.GENERATE_QUESTIONS]: `You are a senior interviewer. Generate interview questions with preferred answers. Return valid JSON only.`,
  [AI_TASKS.ANALYZE_ANSWER]: `You are an expert interview coach. Score answers 0-100 and give constructive feedback. Return valid JSON only.`,
  [AI_TASKS.INTERVIEW_SUMMARY]: `You are a career coach. Summarize interview performance. Return valid JSON only.`,
};

export const getSystemPrompt = (task) => SYSTEM_PROMPTS[task] || "Return valid JSON only.";

export const buildResumeSummaryPrompt = (rawText) => ({
  user: `Summarize this resume in JSON: {"summary":"..."} where summary includes Education, Projects, Experience, Skills, Achievements sections.

Resume:
"""
${rawText.slice(0, 4000)}
"""`,
  schema: { summary: "string" },
  maxTokens: 600,
});

export const buildQuestionsPrompt = (params) => ({
  user: `Generate exactly ${params.num_of_questions} ${params.interview_type} interview questions for a ${params.experience_level} ${params.role} candidate.

Company: ${params.company_name || "N/A"}
Company Description: ${params.company_description || "N/A"}
Job Description: ${params.job_description || "N/A"}
Resume Summary: ${params.resume_summary || "N/A"}
Focus Areas: ${params.focus_area || "N/A"}

Return JSON: {"questions":[{"question":"...","preferred_answer":"..."}]}`,
  schema: { questions: [{ question: "string", preferred_answer: "string" }] },
  maxTokens: 1200,
});

export const buildAnalyzeAnswerPrompt = (params) => ({
  user: `Question: ${params.question}
Preferred Answer: ${params.preferredAnswer}
User Answer: ${params.userAnswer}
Role: ${params.role}
Level: ${params.experience_level}
Type: ${params.interview_type}

Return JSON: {"score":0-100,"feedback":"...","tags":["topic1","topic2"]}`,
  schema: { score: "number", feedback: "string", tags: ["string"] },
  maxTokens: 150,
});

export const buildSummaryPrompt = (combinedFeedback) => ({
  user: `Analyze this interview feedback and return JSON:
{"summary":"overall summary","strengths":"up to 3 strengths","areaOfImprovement":"up to 3 improvements"}

Feedback:
"""
${combinedFeedback.slice(0, 6000)}
"""`,
  schema: { summary: "string", strengths: "string", areaOfImprovement: "string" },
  maxTokens: 400,
});

export const buildPracticeQuestionPrompt = (params) => ({
  user: `Generate 1 ${params.interviewType} interview question for a ${params.experienceLevel} ${params.role}.
Topic: ${params.topic || "general"}
Return JSON: {"questions":[{"question":"...","preferred_answer":"..."}]}`,
  schema: { questions: [{ question: "string", preferred_answer: "string" }] },
  maxTokens: 300,
});
