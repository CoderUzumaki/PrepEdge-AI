import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import ScoreTrendChart from "../components/ScoreTrendChart";
import SummaryCard from "../components/SummaryCard";
import InterviewList from "../components/InterviewList";
import Badges from "../components/Badges";
import StreakCounter from "../components/StreakCounter";
import Leaderboard from "../components/Leaderboard";
import { useAuth } from "../context/AuthContext";
import { useUserData } from "../context/UserDataContext";
import { useState as useLocalState, useEffect as useLocalEffect } from "react";

	const [interviews, setInterviews] = useState([]);
	const [summaryData, setSummaryData] = useState([]);
	const [chartData, setChartData] = useState([]);
	const [leaderboard, setLeaderboard] = useState([]);
	const { user } = useAuth();
	const { userData } = useUserData();
	// Personalized widgets
	const [mockInterviews, setMockInterviews] = useLocalState([]);
	const [recentActivity, setRecentActivity] = useLocalState([]);
	const [recommendedResources, setRecommendedResources] = useLocalState([]);

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

				   // Fetch leaderboard (top 5 users)
				   const leaderboardRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/leaderboard?limit=5`);
				   setLeaderboard(leaderboardRes.data);
			   } catch (error) {
				   console.error("Failed to fetch interviews:", error);
			   }
		   };

		   fetchData();
	   }, [user]);

		 // Fetch personalized widgets
		 useLocalEffect(() => {
			 const fetchWidgets = async () => {
				 try {
					 const [mockRes, activityRes, resourceRes] = await Promise.all([
						 axios.get(`${import.meta.env.VITE_API_URL}/api/mock-interview?upcoming=1`),
						 axios.get(`${import.meta.env.VITE_API_URL}/api/user/activity`),
						 axios.get(`${import.meta.env.VITE_API_URL}/api/resources/recommended`),
					 ]);
					 setMockInterviews(mockRes.data);
					 setRecentActivity(activityRes.data);
					 setRecommendedResources(resourceRes.data);
				 } catch {}
			 };
			 fetchWidgets();
		 }, []);

			 const { t } = useTranslation();
			 return (
				 <div className="min-h-screen bg-gray-50">
					 <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
						 <div className="mb-8">
							 <h1 className="text-3xl font-bold text-gray-900">
								 {t('dashboardTitle', 'Interview Performance Dashboard')}
							 </h1>
							 {/* Gamification Widgets */}
							 <div className="flex flex-wrap gap-6 items-center mt-4">
								 {userData && <Badges badges={userData.badges} />}
								 {userData && <StreakCounter streak={userData.streak} />}
							 </div>
						 </div>

						 {/* Personalized Widgets */}
						 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
							 <div className="bg-white rounded-lg border border-gray-200 p-4">
								 <h3 className="font-semibold mb-2">{t('upcomingMockInterviews', 'Upcoming Mock Interviews')}</h3>
								 <ul>
									 {mockInterviews.map((i) => (
										 <li key={i._id} className="mb-2 text-sm">
											 {new Date(i.scheduledAt).toLocaleString()} ({i.durationMinutes} min)
											 {i.meetingLink && <a href={i.meetingLink} className="ml-2 text-blue-600 underline">{t('join', 'Join')}</a>}
										 </li>
									 ))}
									 {!mockInterviews.length && <li className="text-gray-500">{t('noUpcomingInterviews', 'No upcoming interviews')}</li>}
								 </ul>
							 </div>
							 <div className="bg-white rounded-lg border border-gray-200 p-4">
								 <h3 className="font-semibold mb-2">{t('recentActivity', 'Recent Activity')}</h3>
								 <ul>
									 {recentActivity.map((a, idx) => (
										 <li key={idx} className="mb-2 text-sm">{a}</li>
									 ))}
									 {!recentActivity.length && <li className="text-gray-500">{t('noRecentActivity', 'No recent activity')}</li>}
								 </ul>
							 </div>
							 <div className="bg-white rounded-lg border border-gray-200 p-4">
								 <h3 className="font-semibold mb-2">{t('recommendedResources', 'Recommended Resources')}</h3>
								 <ul>
									 {recommendedResources.map((r) => (
										 <li key={r.id} className="mb-2 text-sm">
											 <a href={r.link} className="text-blue-600 underline">{r.title}</a>
										 </li>
									 ))}
									 {!recommendedResources.length && <li className="text-gray-500">{t('noRecommendations', 'No recommendations')}</li>}
								 </ul>
							 </div>
						 </div>

						 <ScoreTrendChart chartData={chartData} />

						 <div className="mb-8">
							 <h2 className="text-lg font-semibold text-gray-900 mb-6">
								 {t('summary', 'Summary')}
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

						 <div className="mb-8">
							 <Leaderboard users={leaderboard} />
						 </div>

						 <div className="bg-white rounded-lg border border-gray-200 p-6">
							 <InterviewList interviews={interviews} itemsPerPage={3} />
						 </div>
					 </main>
				 </div>
		 );
