import { Link } from "react-router-dom";
import { SiX } from "react-icons/si";
import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#fafaf9] text-gray-900 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-2xl font-bold text-gray-900">PrepEdge AI</span>
            </div>
            <p className="text-lg text-gray-600 mb-4 max-w-md">
              Master your interview skills with AI-powered practice sessions, real-time feedback, 
              and personalized insights to help you land your dream job.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/coderuzumaki/prepedge-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 hover:text-cyan-500 transition-colors duration-200"
                aria-label="GitHub"
              >
                <FaGithub className="h-7 w-7" />
              </a>
              <a
                href="https://x.com/coderUzumaki"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 hover:text-cyan-500 transition-colors duration-200"
                aria-label="Twitter"
              >
                <SiX className="h-6 w-6 mt-0.5" />
              </a>
              <a
                href="https://www.linkedin.com/in/abhinavvv08"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 hover:text-cyan-500 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-7 w-7" />
              </a>
              <a
                href="mailto:astar1013vt@gmail.com"
                className="text-gray-900 hover:text-cyan-500 transition-colors duration-200"
                aria-label="Email"
              >
                <FaEnvelope className="h-7 w-7" />
              </a>
            </div>
          </div>
		  
		  {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4"><u>Quick Links</u></h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-cyan-500 hover:scale-112 transition-all duration-200 inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-cyan-500 hover:scale-112 transition-all duration-200 inline-block">
                  About
                </Link>
              </li>
              <li>
                <Link to="/interview/setup" className="text-gray-600 hover:text-cyan-500 hover:scale-112 transition-all duration-200 inline-block">
                  Practice
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-600 hover:text-cyan-500 hover:scale-112 transition-all duration-200 inline-block">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xl font-semibold mb-4"><u>Support</u></h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-cyan-500 hover:scale-112 transition-all duration-200 inline-block">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-cyan-500 hover:scale-112 transition-all duration-200 inline-block">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-cyan-500 hover:scale-112 transition-all duration-200 inline-block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-cyan-500 hover:scale-112 transition-all duration-200 inline-block">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-100 mt-5 pt-5 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-[14px] sm:text-[16px] md:text-[18px] lg:text-[16px]">
            © {new Date().getFullYear()} PrepEdge AI. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="#" className="text-gray-500 hover:text-cyan-500 text-[14px] sm:text-[16px] md:text-[18px] lg:text-[16px] transition-colors duration-200">
              Privacy
            </Link>
            <Link to="#" className="text-gray-500 hover:text-cyan-500 text-[14px] sm:text-[16px] md:text-[18px] lg:text-[16px] transition-colors duration-200">
              Terms
            </Link>
            <Link to="#" className="text-gray-500 hover:text-cyan-500 text-[14px] sm:text-[16px] md:text-[18px] lg:text-[16px] transition-colors duration-200">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
