import { Link } from "react-router-dom";
import {
	FaArrowRight,
	FaRobot,
	FaMicrophone,
	FaChartLine,
	FaUsers,
	FaUserPlus,
	FaCog,
	FaPlay,
	FaChartBar,
	FaTrophy,
	FaGithub,
	FaStar,
	FaCodeBranch,
	FaHeart,
} from "react-icons/fa";

export default function About() {
	const features = [
		{
			icon: <FaRobot className="w-6 h-6" />,
			title: "AI-Powered Questions",
			description:
				"Get personalized interview questions tailored to your role and experience level.",
		},
		{
			icon: <FaMicrophone className="w-6 h-6" />,
			title: "Voice Analysis",
			description:
				"Practice speaking and receive feedback on your communication skills.",
		},
		{
			icon: <FaChartLine className="w-6 h-6" />,
			title: "Performance Analytics",
			description:
				"Track your progress with detailed insights and improvement suggestions.",
		},
		{
			icon: <FaUsers className="w-6 h-6" />,
			title: "Mock Interviews",
			description:
				"Experience realistic interview simulations in a safe environment.",
		},
	];

	const steps = [
		{
			icon: <FaUserPlus className="w-6 h-6" />,
			title: "Sign Up",
			description:
				"Create your free account and set up your profile with your career goals and experience level.",
			color: "bg-green-500",
		},
		{
			icon: <FaCog className="w-6 h-6" />,
			title: "Customize Your Prep",
			description:
				"Choose your target role, company, and interview type. Upload your resume for personalized questions.",
			color: "bg-purple-500",
		},
		{
			icon: <FaPlay className="w-6 h-6" />,
			title: "Start Practicing",
			description:
				"Begin your mock interviews with AI-generated questions. Practice speaking and get real-time feedback.",
			color: "bg-blue-500",
		},
		{
			icon: <FaChartBar className="w-6 h-6" />,
			title: "Review & Improve",
			description:
				"Analyze your performance with detailed reports. Identify strengths and areas for improvement.",
			color: "bg-orange-500",
		},
		{
			icon: <FaTrophy className="w-6 h-6" />,
			title: "Ace Your Interview",
			description:
				"Apply your learnings in real interviews with confidence and land your dream job!",
			color: "bg-red-500",
		},
	];
	return (
		<div className="min-h-screen bg-white">
			<section className="py-16 lg:py-20 bg-gradient-to-br from-white via-blue-50 to-green-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-1 md:order-1">
                <div className="text-sm font-medium text-blue-600 mb-4 uppercase tracking-wide">
                    About Us
                </div>

                <h1 className="text-4xl lg:text-5xl mb-6 font-bold text-gray-900 leading-tight">
                    Empowering Your Interview Success
                </h1>

                <p className="text-xl text-gray-600 font-medium leading-relaxed mb-8">
                    PrepEdge AI is a cutting-edge platform designed
                    to revolutionize interview preparation. Our
                    mission is to empower job seekers with the tools
                    and resources they need to succeed in today's
                    competitive job market. We leverage advanced AI
                    technology to provide personalized feedback,
                    realistic simulations, and comprehensive
                    learning materials.
                </p>

                <div className="flex flex-col sm:flex-row gap-6">
                    <Link
                        to="/signup"
                        className="inline-flex items-center justify-center px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                    >
                        Get Started
                        <FaArrowRight className="ml-2" />
                    </Link>

                    <a
                        href="#what-is"
                        className="inline-flex items-center justify-center px-8 py-4 bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg transition-colors"
                    >
                        Learn More
                    </a>
                </div>
            </div>

            <div className="order-2 md:order-2 h-64 md:h-80 lg:h-[400px] flex items-center justify-center">
                <img
                    src="/about.png"
                    alt="PrepEdge AI platform illustration"
                    className="w-full h-full object-contain max-w-sm md:max-w-md lg:max-w-lg"
                />
            </div>
        </div>
    </div>
</section>

			<section id="what-is" className="py-16 lg:py-20 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
							What is PrepEdge AI?
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							PrepEdge AI is your personal interview coach,
							powered by artificial intelligence. We combine
							cutting-edge technology with proven interview
							techniques to help you land your dream job.
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{features.map((feature, index) => (
							<div key={index} className="text-center group">
								<div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
									<div className="text-blue-600">
										{feature.icon}
									</div>
								</div>
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									{feature.title}
								</h3>
								<p className="text-gray-600">
									{feature.description}
								</p>
							</div>
						))}
					</div>

					<div className="mt-16 bg-gray-50 rounded-2xl p-8 lg:p-12">
						<div className="text-center">
							<h3 className="text-2xl font-bold text-gray-900 mb-4">
								Built for Modern Job Seekers
							</h3>
							<p className="text-lg text-gray-600 max-w-3xl mx-auto">
								Whether you're a fresh graduate, career changer,
								or experienced professional, PrepEdge AI adapts
								to your needs. Our platform covers technical
								interviews, behavioral questions, system design,
								and more across various industries.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="py-16 lg:py-20 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
							How to Use PrepEdge AI
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							Getting started is simple! Follow these steps to
							begin your interview preparation journey.
						</p>
					</div>

					<div className="relative">
						<div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 hidden lg:block"></div>

						<div className="space-y-12">
							{steps.map((step, index) => (
								<div
									key={index}
									className="relative flex items-start"
								>
									<div className="flex-shrink-0 relative">
										<div
											className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center text-white shadow-lg`}
										>
											{step.icon}
										</div>
										<div className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
											{index + 1}
										</div>
									</div>
									<div className="ml-8 flex-1">
										<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
											<h3 className="text-xl font-semibold text-gray-900 mb-2">
												{step.title}
											</h3>
											<p className="text-gray-600 leading-relaxed">
												{step.description}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="text-center mt-16">
						<Link
							to="/signup"
							className="inline-flex items-center justify-center px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors text-lg"
						>
							Start Your Journey Today
						</Link>
					</div>
				</div>
			</section>

			<section className="py-16 lg:py-20 bg-gradient-to-br from-gray-900 to-black text-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="bg-white bg-opacity-5 rounded-2xl p-8 lg:p-12 backdrop-blur-sm border border-white border-opacity-10 text-center">
						<h3 className="text-2xl font-bold mb-4 text-gray-900">
							Worth a Star?
						</h3>
						<p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
							If this saved you time, sparked an idea, or just felt well-built - drop a star on the repo.
                            It’s a great way to show support - and it helps others discover something they might find useful too.
						</p>
						<div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
							<a
								href="https://github.com/coderuzumaki/prepedge-ai"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-gray-600 border-2 text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
							>
								<FaGithub className="w-5 h-5 mr-2" />
								View on GitHub
							</a>
							<a
								href="https://github.com/coderuzumaki/prepedge-ai"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center justify-center px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg transition-colors"
							>
								<FaStar className="w-5 h-5 mr-2" />
								Star the Repository
							</a>
						</div>
					</div>

					<div className="mt-12 text-center">
						<p className="text-gray-400 italic">
							"Built for people chasing offers. Starred by those who get it."
							<br />
							<span className="text-blue-400">- CoderUzumaki</span>
						</p>
					</div>
				</div>
			</section>
		</div>
	);
}
