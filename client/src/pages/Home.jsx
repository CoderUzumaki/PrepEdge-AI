import Card from "../components/Card";
import FAQ from "../components/FAQ";
import faqData from "../data/faqData";
import { useNavigate } from "react-router-dom";
import { FaRobot, FaMicrophone, FaDesktop, FaChartLine } from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-amber-200 via-orange-100 to-amber-300 rounded-3xl mx-4 mt-8 mb-16 lg:mx-8">
          <div className="max-w-7xl mx-auto px-6 py-16 lg:px-8 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <h1
                  className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-6 break-words text-center px-2 sm:px-0"
                  style={{ wordBreak: "break-word", lineHeight: 1.15 }}
                >
                  Ace Your Interviews with AI
                </h1>
                <p className="text-lg text-gray-700 mb-8 max-w-2xl">
                  PrepEdge AI is an open-source, AI-powered interview
                  preparation platform built with React.js and Tailwind CSS.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    onClick={() => {
                      navigate("/interview/setup");
                    }}
                    className="px-8 py-3 cursor-pointer flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-600 text-white text-lg font-bold border-2 border-blue-800 shadow-md hover:shadow-lg transition-all duration-200"
                    aria-label="Get Started with PrepEdge AI"
                  >
                    Get Started
                  </button>
                  <button
                    onClick={() => {
                      navigate("/about");
                    }}
                    className="px-8 py-3 cursor-pointer flex items-center justify-center rounded-full bg-white hover:bg-indigo-50 text-blue-800 text-lg font-bold border-2 border-blue-800 shadow-md hover:shadow-lg transition-all duration-200"
                    aria-label="Learn More About PrepEdge AI"
                  >
                    Learn More
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="relative z-10">
                  <div className="w-80 h-96 mx-auto relative">
                    <div className="absolute top-0 right-8 w-32 h-24 bg-white rounded-lg shadow-lg border-4 border-gray-800">
                      <div className="p-2">
                        <div className="w-full h-2 bg-gray-300 rounded mb-1"></div>
                        <div className="w-3/4 h-2 bg-gray-300 rounded mb-1"></div>
                        <div className="w-1/2 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-6 h-6 bg-orange-400 rounded-full ml-auto"></div>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                      <div className="w-16 h-16 bg-amber-700 rounded-full mb-2 mx-auto relative">
                        <div className="w-12 h-8 bg-gray-800 rounded-full absolute -bottom-2 left-1/2 transform -translate-x-1/2"></div>
                      </div>
                      <div className="w-20 h-24 bg-teal-600 rounded-t-3xl mx-auto relative">
                        <div className="w-16 h-20 bg-white rounded-t-2xl absolute top-2 left-1/2 transform -translate-x-1/2"></div>
                      </div>
                      <div className="w-20 h-16 bg-gray-800 rounded-b-2xl mx-auto"></div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-8 left-8 w-16 h-20 bg-green-600 rounded-full opacity-80"></div>
                <div className="absolute bottom-8 right-4 w-12 h-16 bg-green-700 rounded-full opacity-60"></div>
                <div className="absolute top-1/2 left-4 w-8 h-10 bg-green-500 rounded-full opacity-70"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Features
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover how our platform can help you ace your next interview with
            these powerful features.
          </p>
        </div>

        <div className="space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                AI-Powered Questions
              </h3>
              <p className="text-gray-600 text-lg">
                Practice with AI-generated interview questions tailored to your
                role and experience level.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 flex justify-center">
              <div className="w-32 h-32 bg-teal-600 rounded-2xl flex items-center justify-center relative">
                <FaRobot className="text-4xl text-white" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-teal-400 rounded-full"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-teal-400 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-8 flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 bg-amber-600 rounded-full flex items-center justify-center relative">
                    <div className="w-20 h-20 bg-amber-700 rounded-full"></div>
                    <div className="absolute -right-4 bottom-4 w-8 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                      <FaMicrophone className="text-white text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Voice Support
              </h3>
              <p className="text-gray-600 text-lg">
                Get real-time feedback on your answers with voice recognition
                and analysis.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Analytics and Insights
              </h3>
              <p className="text-gray-600 text-lg">
                Track your progress and identify areas for improvement with
                detailed analytics.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 flex justify-center">
              <div className="w-48 h-32 bg-teal-700 rounded-lg p-4 relative">
                <div className="bg-white rounded p-2 h-full">
                  <div className="flex justify-between mb-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  </div>
                  <div className="space-y-1 mb-2">
                    <div className="h-1 bg-gray-200 rounded"></div>
                    <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="flex items-end space-x-1 h-12">
                    <div
                      className="w-2 bg-blue-400 rounded-t"
                      style={{ height: "60%" }}
                    ></div>
                    <div
                      className="w-2 bg-blue-400 rounded-t"
                      style={{ height: "40%" }}
                    ></div>
                    <div
                      className="w-2 bg-blue-400 rounded-t"
                      style={{ height: "80%" }}
                    ></div>
                    <div
                      className="w-2 bg-blue-400 rounded-t"
                      style={{ height: "30%" }}
                    ></div>
                    <div
                      className="w-2 bg-green-400 rounded-t"
                      style={{ height: "70%" }}
                    ></div>
                    <div
                      className="w-2 bg-green-400 rounded-t"
                      style={{ height: "50%" }}
                    ></div>
                    <div
                      className="w-2 bg-green-400 rounded-t"
                      style={{ height: "90%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What You’ll Get
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to confidently prepare, practice, and perform
            your best.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            icon={<FaDesktop />}
            title="Personalized Practice"
            description="Get interview questions tailored to your specific role and experience level."
          />
          <Card
            icon={<FaMicrophone />}
            title="Real-time Feedback"
            description="Receive instant feedback on your answers using advanced voice recognition technology."
          />
          <Card
            icon={<FaChartLine />}
            title="Data-Driven Improvement"
            description="Track your performance and identify areas for improvement with detailed analytics."
          />
        </div>
      </section>

      <section className="mb-16">
        <FAQ
          title="Need Help? Start Here."
          subtitle="Explore answers to common questions — and if you need more, we’re just a message away."
          faqs={faqData}
          allowMultipleOpen={false}
        />
      </section>
    </main>
  );
}
