import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ContentSection from "../components/ContentSection";
import ReviewQuestion from "../components/QuestionReview";
import downloadPDF from "../utils/pdfDownload";

export default function InterviewReport() {
	const navigate = useNavigate();
	const { interviewId } = useParams();
	const [report, setReport] = useState(null);
	const [interview, setInterview] = useState(null);

	useEffect(() => {
		const fetchReport = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/api/report/${interviewId}`
				);
				setReport(response.data);

				const interviewResponse = await axios.get(
					`${import.meta.env.VITE_API_URL}/api/interview/${interviewId}`
				);
				setInterview(interviewResponse.data);
			} catch (error) {
				console.error("Error fetching report:", error);
			}
		};

		fetchReport();
	}, [interviewId]);

	const finalScore = report ? report.finalScore : 0;
	const summary = report ? report.summary : "";
	const improvementAreas = report ? report.areaOfImprovement : [];
	const strengths = report ? report.strengths : [];
	const reviewQuestions = report ? report.answers : [];

	
	return (
		<>
			{report && (
				<div className="min-h-screen bg-gray-50">
					<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
						<div className="mb-8">
							<h1 className="text-3xl font-bold text-gray-900 mb-2">
								Interview Report
							</h1>
							<p className="text-gray-600">
								Review your performance and identify areas for
								improvement
							</p>
						</div>

						<div className="mb-8">
							<h2 className="text-lg font-semibold text-gray-900 mb-4">
								Summary Metrics
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="bg-white rounded-lg border border-gray-200 p-6">
									<div className="text-md font-semibold text-gray-600 mb-2">
										Final Score
									</div>
									<div
										className={`text-3xl font-bold text-green-500`}
									>
										{finalScore}%
									</div>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-1 mb-8">
							<ContentSection title="Summary" items={summary} />
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
							<ContentSection
								title="Areas for Improvement"
								items={improvementAreas}
							/>
							<ContentSection
								title="Strengths"
								items={strengths}
							/>
						</div>

						<div className="mb-8">
							<h2 className="text-lg font-semibold text-gray-900 mb-4">
								Review Answers
							</h2>
							<div className="bg-white rounded-lg border border-gray-200 p-6">
								<div className="space-y-4">
									{reviewQuestions.map((question, index) => (
										<ReviewQuestion
											key={index}
											questionNumber={index + 1}
											question={question.question}
											userAnswer={question.userAnswer}
											preferredAnswer={
												question.preferredAnswer
											}
											score={question.score}
											feedback={question.feedback}
											defaultExpanded={false}
										/>
									))}
								</div>
							</div>
						</div>

						<div className="flex justify-end space-x-4">
							<button
								onClick={() => downloadPDF({ report, interview })}
								className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
							>
								Download Report
							</button>
							<button
								onClick={() => navigate("/interview/setup")}
								className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
							>
								Start New Interview
							</button>
						</div>
					</main>
				</div>
			)}
		</>
	);
}
