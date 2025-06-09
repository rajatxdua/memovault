import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ user, logout, setShowThemes, darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  useEffect(() => {
    if (user) {
      const storedDisplayName = localStorage.getItem("profileDisplayName");
      const storedPhotoURL = localStorage.getItem("profilePhotoURL");

      setDisplayName(storedDisplayName || user.displayName || "User");
      setPhotoURL(storedPhotoURL || user.photoURL || "");
    } else {
      setDisplayName("");
      setPhotoURL("");
    }
  }, [user]);

  const handleViewThemes = () => {
    if (setShowThemes && user) {
      setShowThemes(true);
    }
  };

  const handleMemoriesClick = () => {
    if (user) {
      navigate("/memories");
    } else {
      alert("Please sign in to view your memories.");
    }
  };

  return (
    <>
      <nav className={`w-full px-3 sm:px-4 md:px-6 py-2 sm:py-3 flex items-center justify-between sticky top-0 z-50 transition-all duration-300 border-b ${
        darkMode 
          ? 'bg-gray-900/95 backdrop-blur-md text-white border-gray-700' 
          : 'bg-white/95 backdrop-blur-md text-gray-900 border-gray-200'
      }`}>
        {/* Left: Profile (Only if user) */}
        {user ? (
          <div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer flex-1 hover:opacity-80 transition-opacity min-w-0"
            onClick={() => navigate("/profile")}
          >
            {photoURL ? (
              <img 
                src={photoURL} 
                alt="Profile" 
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-indigo-500/50 flex-shrink-0" 
              />
            ) : (
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-xs sm:text-sm ring-2 ring-gray-400/50 flex-shrink-0">
                👤
              </div>
            )}
            <span className="font-bold text-xs sm:text-sm md:text-base px-2 sm:px-3 py-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md truncate max-w-[80px] sm:max-w-[120px] md:max-w-none">
              {displayName || "User"}
            </span>
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {/* Center: MemoVault title (clickable to home) */}
        <div className="flex-1 flex justify-center">
          <button
            className="text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent focus:outline-none hover:scale-105 transition-transform duration-200"
            onClick={() => navigate("/")}
            style={{ letterSpacing: "0.5px" }}
          >
            MemoVault
          </button>
        </div>

        {/* Right: Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 justify-end flex-1 min-w-0">
          {/* Dark Mode Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-all duration-200 ${
              darkMode
                ? 'bg-yellow-500 hover:bg-yellow-400 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <span className="text-lg">
              {darkMode ? '☀️' : '🌙'}
            </span>
          </button>

          {user ? (
            <>
              <button
                className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold shadow-md hover:shadow-lg transition-all text-xs sm:text-sm transform hover:scale-105 min-w-[36px] sm:min-w-auto"
                onClick={handleViewThemes}
              >
                <span className="hidden sm:inline">View Themes</span>
                <span className="sm:hidden text-base">🎨</span>
              </button>
              
              <button 
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline text-xs sm:text-sm transition-colors hidden lg:block"
                onClick={handleMemoriesClick}
              >
                My Memories
              </button>
              <button 
                onClick={logout} 
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:underline text-xs sm:text-sm transition-colors p-1 sm:p-0"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden text-base">🚪</span>
              </button>
            </>
          ) : (
            <button
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-md hover:shadow-lg transition-all text-xs sm:text-sm transform hover:scale-105"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </button>
          )}
        </div>
      </nav>
    </>
  );
}