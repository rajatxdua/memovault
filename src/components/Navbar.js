import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreditsModal from "./CreditsModal";
import { getCredits, getRemainingFreeChats } from "../utils/credits";

export default function Navbar({ user, credits, logout, setShowThemes, darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const [showCredits, setShowCredits] = useState(false);
  const [creditsState, setCreditsState] = useState(0);
  const [freeChatsRemaining, setFreeChatsRemaining] = useState(100);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  useEffect(() => {
    if (user) {
      setCreditsState(getCredits(user.uid) || 0);
      setFreeChatsRemaining(getRemainingFreeChats(user.uid));
      
      // Get profile data from localStorage or user object
      const storedDisplayName = localStorage.getItem("profileDisplayName");
      const storedPhotoURL = localStorage.getItem("profilePhotoURL");
      
      setDisplayName(storedDisplayName || user.displayName || "User");
      setPhotoURL(storedPhotoURL || user.photoURL || "");
    } else {
      setCreditsState(0);
      setFreeChatsRemaining(100);
      setDisplayName("");
      setPhotoURL("");
    }
  }, [user, showCredits]);

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      if (event.detail) {
        setDisplayName(event.detail.displayName);
        setPhotoURL(event.detail.photoURL);
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  const handleCreditsChange = (val) => {
    setCreditsState(val);
    if (user) {
      setFreeChatsRemaining(getRemainingFreeChats(user.uid));
    }
  };

  const handleViewThemes = () => {
    console.log("Navbar - View Themes clicked, user:", !!user, "setShowThemes function:", typeof setShowThemes);
    if (setShowThemes && user) {
      setShowThemes(true);
      console.log("Navbar - setShowThemes(true) called");
    } else {
      console.log("Navbar - Cannot open themes:", { hasSetShowThemes: !!setShowThemes, hasUser: !!user });
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
              
              {/* Free chats indicator */}
              {freeChatsRemaining > 0 && (
                <span
                  className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-mono font-bold text-xs sm:text-sm cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors shadow-sm min-w-[40px] text-center"
                  title="Free messages remaining today"
                >
                  <span className="hidden sm:inline">Free: {freeChatsRemaining}</span>
                  <span className="sm:hidden">{freeChatsRemaining}🆓</span>
                </span>
              )}
              
              {/* Credits */}
              <span
                className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-mono font-bold text-xs sm:text-sm cursor-pointer hover:bg-green-200 dark:hover:bg-green-700 transition-colors shadow-sm min-w-[40px] text-center"
                onClick={() => setShowCredits(true)}
                title={freeChatsRemaining > 0 ? "Credits for premium features" : "Credits (10 per message)"}
              >
                <span className="hidden sm:inline">Credits: {creditsState}</span>
                <span className="sm:hidden">{creditsState}💎</span>
              </span>
              
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

      {/* Credits Modal */}
      {user && (
        <CreditsModal
          open={showCredits}
          onClose={() => setShowCredits(false)}
          user={user}
          onCreditsChange={handleCreditsChange}
        />
      )}
    </>
  );
}