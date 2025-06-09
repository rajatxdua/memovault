import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider, signInWithPopup } from "./firebase";

export default function Auth({ darkMode }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`max-w-md w-full mx-4 p-8 rounded-xl shadow-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-center">
          <h1 className={`text-3xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome to MemoVault
          </h1>
          <p className={`text-base mb-8 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Sign in to start preserving your memories with AI
          </p>
          
          <button
            onClick={login}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:transform-none flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>🚀</span>
                <span>Sign in with Google</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}