import { Link } from "react-router-dom";
import ResourceCard from "../components/ResourceCard";
import resources from "../data/resourcesData";
import featuredResources from "../data/featuredResourcesData";

export default function HeroSection() {
	return (
		<div>
			<section className="relative bg-gradient-to-br from-blue-500 via-green-500 to-emerald-600 overflow-hidden min-h-[600px]">
				<div className="absolute inset-0">
					<div className="absolute inset-0 bg-neutral-950 bg-opacity-10"></div>
					<div className="absolute inset-0 opacity-5">
						<svg
							className="w-full h-full"
							viewBox="0 0 100 100"
							preserveAspectRatio="none"
						>
							<defs>
								<pattern
									id="grid"
									width="10"
									height="10"
									patternUnits="userSpaceOnUse"
								>
									<path
										d="M 10 0 L 0 0 0 10"
										fill="none"
										stroke="white"
										strokeWidth="0.5"
									/>
								</pattern>
							</defs>
							<rect width="100" height="100" fill="url(#grid)" />
						</svg>
					</div>
				</div>

				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<div className="text-stone-50 order-2 lg:order-1">
							<div className="max-w-lg">
								<h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight text-stone-50">
									Ace Your Interviews with
									<span className="block text-white">
										Expert Resources
									</span>
								</h1>
								<p className="text-xl text-stone-50 opacity-90 mb-8 leading-relaxed">
									Unlock a wealth of curated resources to help
									you prepare for your next interview. From
									coding challenges to behavioral questions,
									we've got you covered.
								</p>

								{/* Stats */}
								<div className="flex items-center space-x-6 mb-8">
									<div className="text-center">
										<div className="text-2xl font-bold text-stone-50">
											50+
										</div>
										<div className="text-sm text-stone-50 opacity-80">
											Resources
										</div>
									</div>
									<div className="text-center">
										<div className="text-2xl font-bold text-stone-50">
											10k+
										</div>
										<div className="text-sm text-stone-50 opacity-80">
											Students
										</div>
									</div>
									<div className="text-center">
										<div className="text-2xl font-bold text-stone-50">
											95%
										</div>
										<div className="text-sm text-stone-50 opacity-80">
											Success Rate
										</div>
									</div>
								</div>

								<div className="flex flex-col sm:flex-row gap-4">
									<a
										href="#all-resources"
										className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
									>
										Explore All Resources
										<svg
											className="w-5 h-5 ml-2"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
												clipRule="evenodd"
											/>
										</svg>
									</a>
									<Link
										to="/interview/setup"
										className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-stone-50 font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
									>
										Start Practicing
									</Link>
								</div>
							</div>
						</div>

						<div className="relative order-1 lg:order-2">
							<div className="relative z-10">
								<div className="relative bg-white bg-opacity-10 rounded-3xl p-8 backdrop-blur-sm border border-white border-opacity-20">
									<img
										src="/hero-image.jpg"
										alt="Student studying with laptop, books, and headphones in a modern workspace"
										className="w-full h-auto max-w-md mx-auto drop-shadow-2xl"
										crossOrigin="anonymous"
									/>
								</div>

								<div className="absolute -top-4 -right-4 w-20 h-20 bg-white bg-opacity-10 rounded-full backdrop-blur-sm animate-pulse"></div>
								<div className="absolute -bottom-6 -left-6 w-16 h-16 bg-blue-300 bg-opacity-20 rounded-full backdrop-blur-sm animate-bounce"></div>

								<div className="absolute -left-4 top-1/4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg transform -rotate-3 hover:rotate-0 transition-transform">
									<div className="flex items-center space-x-2">
										<div className="w-3 h-3 bg-green-500 rounded-full"></div>
										<span className="text-sm font-medium text-gray-800">
											Interactive Learning
										</span>
									</div>
								</div>

								<div className="absolute -right-6 top-2/3 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg transform rotate-3 hover:rotate-0 transition-transform">
									<div className="flex items-center space-x-2">
										<div className="w-3 h-3 bg-blue-500 rounded-full"></div>
										<span className="text-sm font-medium text-gray-800">
											Expert Guidance
										</span>
									</div>
								</div>
							</div>

							<div className="absolute top-8 right-8 w-32 h-32 bg-gradient-to-br from-teal-300 to-green-300 rounded-full opacity-20 blur-xl"></div>
							<div className="absolute bottom-8 left-8 w-24 h-24 bg-gradient-to-br from-green-300 to-teal-300 rounded-full opacity-20 blur-xl"></div>
						</div>
					</div>
				</div>
			</section>

            <section id="featured-resources" className="relative py-16 bg-gradient-to-br from-gray-200 via-stone-50 to-white">
                <div className="absolute inset-0">
					<div className="absolute inset-0 bg-gray-100 bg-opacity-10"></div>
				</div>
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Resources</h2>
                        <p className="text-lg text-gray-500 mb-4">Handpicked Resources to get yourself started on your Interview prep journey!</p>
                    </div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
						{featuredResources.map((resource) => (
							<ResourceCard key={resource.id} {...resource} />
						))}
					</div>
				</div>
			</section>

			<section id="all-resources" className="py-16 bg-stone-50 -mb-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">All Resources</h2>
                    </div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{resources.map((resource) => (
							<ResourceCard key={resource.id} {...resource} />
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
