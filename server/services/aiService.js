import { InferenceClient } from "@huggingface/inference";

if (!process.env.HUGGING_FACE_API_KEY) {
  throw new Error("Missing Hugging Face API Key in environment");
}
const hf = new InferenceClient(process.env.HUGGING_FACE_API_KEY);

const summarizeResumeText = async (rawText) => {
  const prompt = `
You are an expert resume reviewer.

Extract and summarize the following structured information from the resume text below:

Resume:
"""
${rawText}
"""

Return the summary in this format:

- Education: <highest degree, major, college name, year>
- Projects: <2–3 notable projects with tech stack and outcome>
- Experience: <Key roles, company names, durations, responsibilities>
- Skills: <Most relevant technical and soft skills>
- Achievements: <Notable awards, recognitions, rankings>

If any category is missing, simply write "Not mentioned".
`;

  try {
    const res = await hf.chatCompletion({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
    });

    const summary = res.choices[0].message.content.trim();
    return summary;
  } catch (error) {
    return "Resume could not be summarized due to an error.";
  }
}

const generateQuestions = async ({
  num_of_questions,
  interview_type,
  role,
  experience_level,
  company_name,
  company_description,
  job_description,
  focus_area,
  resume_summary,
}) => {
  const prompt = `You are a senior technical interviewer and HR expert specializing in AI-driven interview assessments.

Your task is to generate ${num_of_questions} well-crafted, high-quality ${
    interview_type === "mixed"
        ? "technical and behavioral"
        : interview_type
} interview questions for a ${experience_level} candidate applying for the role of ${role} at ${
    company_name || "PrepEdge AI"
}.

 Contextual Information:

Company Description:
${company_description || "Not provided."}

Job Description:
${job_description || "Not provided."}

Resume Summary (Projects, Education, Skills, Experience):
${resume_summary || "Not provided."}

Candidate Focus Areas (e.g., DS, System Design, etc.):
${focus_area || "None specified."}

 Instructions:
- Generate a diverse mix of questions that align with the resume, job description, and candidate level.
- For technical questions, focus on core concepts, problem-solving, system design (if applicable), and resume-aligned skills or projects.
- For behavioral questions, include classic prompts like:
  - “Tell me about yourself.”
  - “What are your strengths and weaknesses?”
  - “Describe a time you faced a challenge and how you overcame it.”
  - “Why do you want this role/company?”
- Prioritize relevance to the role, resume, and company mission when crafting behavioral questions.
- Keep questions clear, concise, and numbered (e.g., 1., 2., 3.).

For each question, immediately follow it with an ideal response labeled as:

Preferred Answer: followed by a 1–2 sentence ideal answer (based on the resume, job context, and experience level).

 Output Format:
Numbered list with each question followed by its preferred answer on a new line.

 Example:
1. What is a linked list?  
   Preferred Answer: A linked list is a linear data structure where each element is a node containing data and a reference to the next node.

2. Tell me about yourself.  
   Preferred Answer: I'm a recent Computer Science graduate with a strong interest in frontend development, having completed 3 projects using React and Tailwind.

Ensure that:
- Technical questions target relevant frameworks, tools, or topics listed in the resume.
- Behavioral questions are introspective and role-focused.
- Answers are not generic — personalize wherever resume data allows.

`;

  try {
    const response = await hf.chatCompletion({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
    });
console.log("Raw Hugging Face API response:", JSON.stringify(response, null, 2));

    const generatedText = response.choices[0].message.content;
    console.log("AI generated questions text:\n", generatedText);

    const questions = [];
    const lines = generatedText.split("\n");
    let currentQuestion = null;
    let collectingAnswer = false;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      if (/^\d+\.\s/.test(line)) {
        if (currentQuestion && currentQuestion.preferred_answer) {
          questions.push(currentQuestion); // Push completed question
        }
        currentQuestion = { question: line.replace(/^\d+\.\s/, "").trim(), preferred_answer: "" };
        collectingAnswer = true;
      } else if (collectingAnswer && line.startsWith("Preferred Answer:")) {
        currentQuestion.preferred_answer = line.replace("Preferred Answer:", "").trim();
        collectingAnswer = false; // Stop collecting after capturing the answer
      } else if (collectingAnswer && currentQuestion && !currentQuestion.preferred_answer && line.trim()) {
        // Append to preferred_answer if it spans multiple lines
        currentQuestion.preferred_answer += (currentQuestion.preferred_answer ? " " : "") + line.trim();
      }

      if (questions.length === num_of_questions - 1 && currentQuestion && currentQuestion.preferred_answer) {
        questions.push(currentQuestion); // Push the last question
        break;
      }
    }

    if (currentQuestion && !questions.includes(currentQuestion) && currentQuestion.preferred_answer) {
      questions.push(currentQuestion); // Ensure the last question is added
    }

    if (questions.length < num_of_questions) {
      throw new Error(`Only ${questions.length} valid questions generated, expected ${num_of_questions}`);
    }

    return questions;
  } catch (error) {
            console.error("Question generation error:", error);

    throw new Error(
      `Error generating questions: ${error?.message || JSON.stringify(error)}`
    );
  }
};

const analyzeAnswer = async ({ question, userAnswer, preferredAnswer, role, experience_level, interview_type }) => {
  const prompt = `You are an expert technical and HR interviewer and AI coach.

Analyze the user's answer "${userAnswer}" in response to the question "${question}", comparing it to the ideal preferred answer "${preferredAnswer}". Consider the following context:
- Role: ${role || "Not specified"}
- Experience Level: ${experience_level || "Not specified"}
- Interview Type: ${interview_type || "Not specified"}

Provide a detailed evaluation with the following format:
- Score: A numerical score out of 100 reflecting the accuracy and completeness of the user's answer.
- Feedback: A concise, constructive analysis of the user's answer, highlighting strengths and areas for improvement.

Ensure the analysis is concise, constructive, and tailored to the question's context, role, and experience level. Output the response in the exact format above, with each item on a new line.

Example:
- Score: 85
- Feedback: The user provided a clear explanation of linked lists, demonstrating good understanding of the concept. However, they could improve by discussing time complexity and practical applications in real-world scenarios.
`;

  try {
    const response = await hf.chatCompletion({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 250,
    });

    const generatedText = response.choices[0].message.content;
    const lines = generatedText.split("\n").map(line => line.trim());
    let score = 0;
    let feedback = "Analysis failed to provide feedback";

    lines.forEach(line => {
      if (line.startsWith("- Score:")) {
        score = parseInt(line.replace("- Score:", "").trim()) || 80;
      } else if (line.startsWith("- Feedback:")) {
        feedback = line.replace("- Feedback:", "").trim() || feedback;
      }
    });

    if (score < 0 || score > 100) {
      throw new Error("Invalid score generated by model");
    }

    return { score, feedback };
  } catch (error) {
    return { score: 0, feedback: "Analysis failed" };
  }
};

const interviewSummary = async (combinedFeedback) => {
  const feedbackText = combinedFeedback?.trim() || "No feedback provided.";

  const prompt = `I have a combined text containing raw feedback for my interview question and answers. I want you to analyze it and generate the following structured outputs:

- Overall Summary: A concise, reflective summary of how the interview went overall and what key takeaways I should carry forward.
- Strengths: Provide up to 3 strengths, each with a short title and a description of 2–3 lines that highlights the positive aspects of my performance.
- Areas of Improvement: Provide up to 3 improvement areas, each with a title and a 2–3 line explanation, focusing on what I can do better in future interviews.

Make sure the tone is constructive and personalized, like it’s talking directly to me.

Here is the raw feedback input:
""" 
${feedbackText}
"""`;

  try {
    const response = await hf.chatCompletion({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });

    const generatedText = response.choices[0].message.content;

    return generatedText.trim();
  } catch (error) {
    return "Interview summary could not be generated due to an error.";
  }
};

export { summarizeResumeText, generateQuestions, analyzeAnswer, interviewSummary };