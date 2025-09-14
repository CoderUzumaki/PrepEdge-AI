import { useState, useEffect } from "react";
import axios from "axios";
import ScoreTrendChart from "../components/ScoreTrendChart";
import SummaryCard from "../components/SummaryCard";
import InterviewList from "../components/InterviewList";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
	const [interviews, setInterviews] = useState([]);
	const [summaryData, setSummaryData] = useState([]);
	const [chartData, setChartData] = useState([]);
	const { user } = useAuth();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = await user.getIdToken();
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/api/interview`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setInterviews(response.data);

				const reportResponse = await axios.get(
					`${import.meta.env.VITE_API_URL}/api/report`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				const chartData = reportResponse.data.map((report) => ({
					date: new Date(report.createdAt).toLocaleDateString(),
					score: Number(report.finalScore) || 0,
					interviewName: report.interviewId?.interview_name || "N/A",
				}));
				setChartData(chartData);

				const bestScore = Math.max(
					...reportResponse.data.map((i) => i.finalScore || 0)
				);

				const totalInterviews = response.data.length;
				const roleCounts = response.data
					.map((i) => i.role)
					.reduce((acc, role) => {
						acc[role] = (acc[role] || 0) + 1;
						return acc;
					}, {});
				const mostCommonRole =
					Object.entries(roleCounts).sort(
						(a, b) => b[1] - a[1]
					)[0]?.[0] || "N/A";

				setSummaryData([
					{ title: "Total Interviews", value: totalInterviews },
					{ title: "Best Score", value: bestScore.toFixed(2) },
					{ title: "Most Common Role", value: mostCommonRole },
				]);
			} catch (error) {
				console.error("Failed to fetch interviews:", error);
			}
		};

		fetchData();
	}, [user]);

	return (
		<div className="min-h-screen bg-gray-50">

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">
						Interview Performance Dashboard
					</h1>
				</div>

				<ScoreTrendChart
					chartData={chartData}
				/>

				<div className="mb-8">
					<h2 className="text-lg font-semibold text-gray-900 mb-6">
						Summary
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{summaryData.map((item, index) => (
							<SummaryCard
								key={index}
								title={item.title}
								value={item.value}
							/>
						))}
					</div>
				</div>

				<div className="bg-white rounded-lg border border-gray-200 p-6">
					<InterviewList interviews={interviews} itemsPerPage={3} />
				</div>
			</main>

		</div>
	);
}
