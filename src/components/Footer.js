// src/components/Footer.js
import React from "react";

export default function Footer({ darkMode }) {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/rajatxdua/memovault",
      icon: "🐙",
      description: "Check out the code",
    },
    {
      name: "LinkedIn",
      url: "www.linkedin.com/in/rajatxdua",
      icon: "💼",
      description: "Connect professionally",
    },
    {
      name: "Twitter",
      url: "https://x.com/rajatxdua",
      icon: "🐦",
      description: "Follow for updates",
    },
    {
      name: "Portfolio",
      url: "",
      icon: "🌐",
      description: "Visit my portfolio",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/therajatdua?igsh=aG9pMTVyOTJlZTJ3&utm_source=qr",
      icon: "📸",
      description: "Follow on Instagram",
    },
  ];

  const contactEmail = "workspace.rajatdua@gmail.com";

  return (
    <footer
      className={`mt-auto border-t transition-all duration-300 ${
        darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* About MemoVault */}
          <div className="text-center md:text-left">
            <h3
              className={`text-lg font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent`}
            >
              MemoVault
            </h3>
            <p
              className={`text-sm mb-3 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              An intelligent memory companion that helps you preserve, explore, and
              cherish your precious moments with the power of AI.
            </p>
            <div
              className={`text-xs ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              🧠 Powered by Google Gemini AI
            </div>
          </div>

          {/* Creator Info */}
          <div className="text-center">
            <h3
              className={`text-lg font-semibold mb-3 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Created By
            </h3>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl text-white font-bold shadow-lg">
                🧙‍♂️
              </div>
              <h4
                className={`font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Rajat Dua
              </h4>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Full Stack Developer & AI Enthusiast
              </p>
              <p
                className={`text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Part coder, part wizard, master of the digital realm ✨
              </p>
            </div>
          </div>

          {/* Contact & Links */}
          <div className="text-center md:text-right">
            <h3
              className={`text-lg font-semibold mb-3 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Connect
            </h3>

            {/* Email */}
            <div className="mb-4">
              <a
                href={`mailto:${contactEmail}`}
                className={`inline-flex items-center space-x-2 text-sm hover:underline transition-colors ${
                  darkMode
                    ? "text-indigo-400 hover:text-indigo-300"
                    : "text-indigo-600 hover:text-indigo-700"
                }`}
              >
                <span>📧</span>
                <span>{contactEmail}</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-2 gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center space-x-1 p-2 rounded-lg text-xs transition-all duration-200 hover:scale-105 ${
                    darkMode
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                  }`}
                  title={link.description}
                >
                  <span>{link.icon}</span>
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className={`border-t pt-6 ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          {/* Tech Stack */}
          <div className="text-center mb-4">
            <p
              className={`text-xs mb-2 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Built with
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { name: "React", icon: "⚛️" },
                { name: "Firebase", icon: "🔥" },
                { name: "Tailwind CSS", icon: "🎨" },
                { name: "Google Gemini", icon: "🧠" },
                { name: "Vercel", icon: "▲" },
              ].map((tech) => (
                <span
                  key={tech.name}
                  className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                    darkMode
                      ? "bg-gray-800 text-gray-300"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <span>{tech.icon}</span>
                  <span>{tech.name}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Copyright & Links */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div
              className={`text-xs ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              © {currentYear} MemoVault. Crafted with ❤️ by{" "}
              <a
                href="https://www.instagram.com/therajatdua?igsh=aG9pMTVyOTJlZTJ3&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:underline ${
                  darkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              >
                Rajat Dua
              </a>
            </div>

            <div className="flex space-x-4 text-xs">
              <button
                onClick={() =>
                  alert(
                    "Privacy Policy: Your data is stored locally and in Firebase. We never share your personal information."
                  )
                }
                className={`hover:underline ${
                  darkMode
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Privacy Policy
              </button>
              <button
                onClick={() =>
                  alert(
                    "Terms of Service: Use MemoVault responsibly and enjoy preserving your memories!"
                  )
                }
                className={`hover:underline ${
                  darkMode
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Terms of Service
              </button>
              <a
                href={`mailto:${contactEmail}?subject=MemoVault Feedback`}
                className={`hover:underline ${
                  darkMode
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Feedback
              </a>
            </div>
          </div>

          {/* Fun Quote */}
          <div className="text-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p
              className={`text-xs italic ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              "Every memory is a treasure, every moment a story worth preserving."
              ✨
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
