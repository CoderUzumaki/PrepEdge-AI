
 * @license MIT License
 * Copyright (c) 2025 Abhinav Mishra
 

import express from "express";
import Interview from "../models/InterviewModel.js";
import Report from "../models/ReportModel.js";
import User from "../models/UserModel.js";
import firebaseAuthMiddleware from "../middleware/firebaseAuthMiddleware.js";
import multer from "multer";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";
import pdfParse from "pdf-parse";
import {
	summarizeResumeText,
	generateQuestions,
	analyzeAnswer,
	interviewSummary,
} from "../services/aiService.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post(
	"/setup",
	firebaseAuthMiddleware,
	upload.single("resume"),
	async (req, res) => {
		try {
			if (!req.body || !req.body.interviewName) {
				return res
					.status(400)
					.json({ error: "Incomplete form submission" });
			}
			const {
				interviewName,
				numOfQuestions,
				interviewType,
				role,
				experienceLevel,
				companyName,
				companyDescription,
				jobDescription,
				focusAt,
			} = req.body;
			const firebaseUID = req.firebaseUser?.uid;
			const user = await User.findOne({ firebase_user_id: firebaseUID });
			if (!user) return res.status(404).json({ error: "User not found" });

			let resume_link = null;
			let resume_text = null;
			if (req.file && req.file.buffer) {
				const streamUpload = () =>
					new Promise((resolve, reject) => {
						const stream = cloudinary.uploader.upload_stream(
							{
								resource_type: "raw",
								folder: "prepEdge/resumes",
							},
							(error, result) => {
								if (error) return reject(error);
								resolve(result);
							}
						);
						streamifier
							.createReadStream(req.file.buffer)
							.pipe(stream);
					});

				try {
					const result = await streamUpload();
					resume_link = result.secure_url;
				} catch (uploadErr) {
					return res
						.status(500)
						.json({ error: "Cloudinary upload failed" });
				}
				const pdfData = await pdfParse(req.file.buffer);
				resume_text = pdfData.text.slice(0, 4000);
			}

			let resumeSummary = null;
			if (resume_text) {
				try {
					resumeSummary = await summarizeResumeText(resume_text);
				} catch (err) {
					return res
						.status(500)
						.json({ error: "Resume summarization failed" });
				}
			}

			let questions;
			try {
				questions = await generateQuestions({
					num_of_questions: numOfQuestions,
					interview_type: interviewType,
					role,
					experience_level: experienceLevel,
					company_name: companyName,
					company_description: companyDescription,
					job_description: jobDescription,
					focus_area: focusAt,
				});
			} catch (err) {
				return res
					.status(500)
					.json({ error: "Question generation failed" });
			}

			if (!questions || questions.length === 0) {
				return res
					.status(400)
					.json({ error: "Failed to generate questions" });
			}

			const interview = new Interview({
				user_id: user._id,
				interview_name: interviewName,
				num_of_questions: numOfQuestions,
				interview_type: interviewType.toLowerCase(),
				role,
				experience_level: experienceLevel.toLowerCase(),
				company_name: companyName,
				company_description: companyDescription,
				job_description: jobDescription,
				resume_link,
				focus_area: focusAt,
				questions,
			});
			await interview.save();

			res.status(201).json({
				message: "Interview setup successfully",
				interview,
			});
		} catch (err) {
			res.status(500).json({ error: "Failed to set up interview" });
		}
	}
);

router.get("/:interviewId", async (req, res) => {
	const interview = await Interview.findById(req.params.interviewId);
	res.json(interview);
});

router.post("/:interviewId/answer", async (req, res) => {
	const { questionId, answer } = req.body;
	const interview = await Interview.findById(req.params.interviewId);
	const question = interview.questions[questionId];

	// Analyze user's answer using AI
	const { score, feedback } = await analyzeAnswer({
		question: question.question,
		userAnswer: answer,
		preferredAnswer: question.preferred_answer,
		role: interview.role,
		experience_level: interview.experience_level,
		interview_type: interview.interview_type,
	});

	// create or update the report
	let report = await Report.findOne({ interviewId: req.params.interviewId });
	if (!report) {
		report = new Report({
			interviewId: req.params.interviewId,
			userId: interview.user_id,
			answers: [],
		});
	}

	// Add the answers' analysis to the report
	report.answers.push({
		question: question.question,
		userAnswer: answer,
		preferredAnswer: question.preferred_answer,
		score,
		feedback,
	});

	// if all answers are analyzed, calculate final score and summary
	const totalQuestions = interview.num_of_questions;
	const totalAnswered = report.answers.length;
	if (totalAnswered === totalQuestions) {
		// Final Score
		const avgScore =
			report.answers.reduce((sum, ans) => sum + ans.score, 0) /
			report.answers.length;

		// Generate overall summary, strengths, and areas of improvement
		const combinedFeedback = report.answers
			.map((a) => a.feedback)
			.join("\n");
		const summaryText = await interviewSummary(combinedFeedback);

		const extractSection = (label) => {
			const match = summaryText.match(
				new RegExp(
					`\\*\\*${label}:\\*\\*\\s*([\\s\\S]*?)(?=\\*\\*|$)`,
					"i"
				)
			);
			return match ? match[1].trim() : "";
		};

		const overall = extractSection("Overall Summary");
		const strengths = extractSection("Strengths");
		const areas = extractSection("Areas of Improvement");

		// Update report with final score, strengths, areas of improvement, and summary
		report.finalScore = avgScore.toFixed(2);
		report.strengths = strengths;
		report.areaOfImprovement = areas;
		report.summary = overall;
	}

	await report.save();
	res.status(201).json({ success: true });
});

router.get("/", firebaseAuthMiddleware, async (req, res) => {
	const decodedToken = req.firebaseUser;
	if (!decodedToken || !decodedToken.uid) {
		return res.status(401).json({ error: "Unauthorized" });
	}
	const user = await User.findOne({
		firebase_user_id: decodedToken.uid,
	});
	const interviews = await Interview.find({ user_id: user._id });
	res.json(interviews);
});

export default router;


