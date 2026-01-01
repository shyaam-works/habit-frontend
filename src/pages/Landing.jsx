// src/pages/LandingPage.jsx

import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const LandingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 px-4 py-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl"
      >
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Main Content */}
            <div className="p-8 md:p-10 lg:p-12 flex flex-col justify-center space-y-7">
              <motion.div variants={item}>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                  Build Habits
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                    That Last
                  </span>
                </h1>
              </motion.div>

              <motion.p
                variants={item}
                className="text-base md:text-lg text-gray-600 leading-relaxed"
              >
                A clean, powerful habit tracker that helps you stay consistent
                with beautiful visuals, deep analytics, and a distraction-free
                experience.
              </motion.p>

              <motion.div variants={item} className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span className="text-sm md:text-base">
                    GitHub-style contribution heatmaps
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span className="text-sm md:text-base">
                    Weekly, monthly & yearly analytics
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span className="text-sm md:text-base">
                    Flexible marking with honest streak tracking
                  </span>
                </div>
              </motion.div>

              <motion.div
                variants={item}
                className="flex flex-col sm:flex-row gap-3 pt-4"
              >
                <Link
                  to="/login"
                  className="px-6 py-3 rounded-xl text-white font-semibold text-center
                             bg-gradient-to-r from-emerald-600 to-teal-600
                             shadow-md hover:shadow-lg hover:from-emerald-700 hover:to-teal-700
                             transition-all duration-300"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-6 py-3 rounded-xl font-semibold text-center text-emerald-700
                             bg-emerald-50 border border-emerald-200
                             hover:bg-emerald-100 transition-all duration-300"
                >
                  Sign Up Free
                </Link>
              </motion.div>
            </div>

            {/* Right: Highlight Panel */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 md:p-10 lg:p-12 flex flex-col justify-between text-white">
              <motion.div variants={item} className="space-y-5">
                <h2 className="text-2xl md:text-3xl font-bold">
                  Track Smarter, Grow Better
                </h2>
                <p className="text-emerald-100 text-sm md:text-base leading-relaxed">
                  Visualize your progress with intuitive charts and heatmaps.
                  Understand your patterns over weeks, months, and years — all
                  in a clean, focused interface designed for long-term success.
                </p>
              </motion.div>

              <motion.div variants={item} className="mt-8 space-y-4">
                <a
                  href="https://github.com/shyaam-works/habit-frontend" // ← Update with your real repo URL
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-6 py-3 rounded-xl font-medium
                             bg-white/20 backdrop-blur-sm border border-white/30
                             hover:bg-white/30 transition-all duration-300"
                >
                  View Project on GitHub
                </a>

                <p className="text-emerald-100 text-xs md:text-sm text-center opacity-80">
                  Open source • Minimal • Built for the long term
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        <motion.p
          variants={item}
          className="text-center mt-8 text-sm text-gray-500"
        >
          Designed for people serious about change.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LandingPage;
