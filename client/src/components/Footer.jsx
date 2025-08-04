import { Link } from "react-router-dom";

export default function Footer() {
	// Function to scroll to top when navigating
	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<footer className="bg-gray-50 border-t border-gray-200 mt-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
					<Link
						to="/about"
						onClick={scrollToTop}
						className="text-blue-600 hover:text-blue-700 transition-colors"
					>
						About
					</Link>
					<Link
						to="/contact"
						onClick={scrollToTop}
						className="text-blue-600 hover:text-blue-700 transition-colors"
					>
						Contact Us
					</Link>
					<a
						href="https://github.com/CoderUzumaki/prepedge-ai"
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-600 hover:text-blue-700 transition-colors flex items-center"
					>
						GitHub
					</a>
				</div>
				<div className="text-center mt-8">
					<p className="text-gray-600">
						{`© ${new Date().getFullYear()} PrepEdge AI. All rights reserved.`}
					</p>
				</div>
			</div>
		</footer>
	);
}