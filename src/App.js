import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Home from "./Home";
import Auth from "./Auth";
import Profile from "./Profile";
import Memories from "./components/Memories";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false); // State for footer visibility

  useEffect(() => {
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false); // Ensure loading state is updated
    });

    return () => unsubscribe();
  }, []);

  // Effect for handling scroll-based footer visibility
  useEffect(() => {
    const handleScroll = () => {
      const showFooterThreshold = 10; // DRASTICALLY REDUCED: Pixels to scroll down
      const hideFooterAtTopThreshold = 5; // Pixels from top to hide footer again

      console.log(
        'ScrollY:', window.scrollY,
        'ShowThreshold:', showFooterThreshold,
        'IsFooterVisible (before):', isFooterVisible,
        'DocScrollHeight:', document.documentElement.scrollHeight,
        'WindowInnerHeight:', window.innerHeight
      );

      if (window.scrollY > showFooterThreshold) {
        if (!isFooterVisible) {
          console.log('Setting isFooterVisible to TRUE');
          setIsFooterVisible(true);
        }
      } else if (window.scrollY < hideFooterAtTopThreshold) {
        if (isFooterVisible) {
          console.log('Setting isFooterVisible to FALSE');
          setIsFooterVisible(false);
        }
      }
      // If scrollY is between hideFooterAtTopThreshold and showFooterThreshold,
      // and footer is visible, it remains visible.
    };

    window.addEventListener('scroll', handleScroll);
    // Call once on mount to set initial state based on current scroll
    // and to log initial values
    handleScroll(); 

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isFooterVisible]); // Add isFooterVisible to dependency array to ensure logs reflect its changes

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
          <Navbar 
            user={user} 
            logout={logout}
            setShowThemes={setShowThemes}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
          
          <main className="flex-1 pt-4">
            <Routes>
              <Route 
                path="/" 
                element={
                  <Home 
                    user={user} 
                    darkMode={darkMode}
                    showThemes={showThemes}
                    setShowThemes={setShowThemes}
                  />
                } 
              />
              <Route 
                path="/auth" 
                element={user ? <Navigate to="/" /> : <Auth darkMode={darkMode} />} 
              />
              <Route 
                path="/profile" 
                element={user ? <Profile darkMode={darkMode} /> : <Navigate to="/auth" />} 
              />
              <Route 
                path="/memories" 
                element={user ? <Memories darkMode={darkMode} /> : <Navigate to="/auth" />} 
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          {isFooterVisible && <Footer darkMode={darkMode} />} {/* Conditionally render Footer */}
        </div>
      </Router>
    </div>
  );
}
