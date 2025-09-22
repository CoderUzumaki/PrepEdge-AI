import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { variantsContext } from "../context/motionContext";
import { useContext } from "react";
import { motion } from "framer-motion";

export default function Animated404() {
  const sharedData = useContext(variantsContext);
  const { textvariant, paraVariant } = sharedData;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4 overflow-hidden">
      <div
        className={`text-center transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-black text-white mb-4 animate-pulse">
            4<span className="inline-block animate-bounce delay-100">0</span>
            <span className="inline-block animate-bounce delay-200">4</span>
          </h1>
          <div className="w-32 h-2 bg-white/30 mx-auto rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="mb-8 text-white">
          <motion.h2
            initial="hidden"
            animate="visible"
            variants={textvariant}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            We have a problem!
          </motion.h2>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={paraVariant}
            className="text-xl opacity-90 mb-2"
          >
            The page you're looking for isn't available.
          </motion.p>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={paraVariant}
            className="text-lg opacity-75"
          >
            Let's get you back to Home.
          </motion.p>
        </div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white/20 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-white/10 rounded-full animate-pulse delay-300"></div>
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-white/15 rounded-full animate-bounce delay-500"></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={textvariant}>
            <Link
              href="/"
              className="px-6 py-3 bg-white text-gray-800 hover:bg-gray-100 shadow-lg rounded-md flex items-center gap-2 text-sm font-medium transition-all duration-200 transform hover:scale-105"
            >
              Return to Home
            </Link>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={textvariant}>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                history.back();
              }}
              className="px-6 py-3 border border-white text-white hover:bg-white hover:text-gray-800 shadow-lg rounded-md flex items-center gap-2 text-sm font-medium transition-all duration-200 transform hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
