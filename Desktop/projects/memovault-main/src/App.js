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
import { getCredits } from "./utils/credits";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showThemes, setShowThemes] = useState(false);

  useEffect(() => {
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
            credits={user ? getCredits(user.uid) : 0}
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

          <Footer darkMode={darkMode} />
        </div>
      </Router>
    </div>
  );
}
